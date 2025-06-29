import requests
import json
import urllib.parse
import uuid
import time
from datetime import datetime

""" INFO DE ICP """
NIT = "06142501560105"  # Replace with your actual NIT
PASSWORD_PRI = "S9z@qp3WlXadsf3"  # Replace with your actual password
CODIGO_HACIENDA = "M9z@qp3WlX"  # Replace with your actual code
STARTING_NUMBER = 100  # Starting number for the numeroControl
NUM_ITERATIONS = 100  # Number of times to run the script
CODACTIVITY = "86203"  # Replace with your actual activity code
NRC = "790338"  # Replace with your actual NRC

def main():
    current_number = STARTING_NUMBER
    
    for iteration in range(NUM_ITERATIONS):
        print(f"\n===== ITERATION {iteration+1}/{NUM_ITERATIONS} =====")
        
        # Generate a new UUID for codigoGeneracion
        new_codigo_generacion = str(uuid.uuid4()).upper()
        codigoGeneracion = ["8397796F-B064-4DAB-881F-BD7BADBABBC4","3E4521AE-4372-4ABA-84F9-CC957426701F", "8C007CD8-2F4B-42CA-AD35-AC1D1684534D", "41BA623A-7C77-4366-A4A0-49ECF64C59AD", "523F728C-EF5E-483F-9B6F-7ADCE0AC6E2B", "562AE3A1-1BF1-462F-AC13-581D8BC7F27A"]
        selloRecibido = ["20255B98D0E042D640A189E2B23287B7CA07BJIL","2025F6CB93CFEA3348468426E0DD0D2CDF2FKZSJ", "2025F9016C2A6957481788342C4D1A8A347CZCUR", "2025B15173D60CC04265A23AE06DED52AEA4QBXJ", "2025E3106E3645834DE991987DF8EB6BD625TLWZ",  "20253D7A5B9DDA2F4657869EC9AFD7BDF78BJ8PI"]
        numeroControl = ["DTE-01-00000000-000000000000210","DTE-01-00000000-000000000000211", "DTE-01-00000000-000000000000212", "DTE-01-00000000-000000000000213", "DTE-01-00000000-000000000000214", "DTE-01-00000000-000000000000215"]

        
        # Update the numeroControl with the current number
        numero_control = f"DTE-01-00000000-000000000000{current_number}"
        
        # Update current date and time
        current_date = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")
        
        # Define the JSON data to send in the first call
        firm_data = {
            "nit": NIT,
            "activo": True,
            "passwordPri": PASSWORD_PRI,
            "dteJson": {
        "identificacion": {
            "version": 2,
            "ambiente": "00",
            "codigoGeneracion": new_codigo_generacion,
            "fecAnula": current_date,
            "horAnula": current_time
        },
        "emisor": {
                        "nit": NIT,

                        "nombre": "Julio César Hernández Magaña ",

            "tipoEstablecimiento": "02",
            "nomEstablecimiento": "servicios médicos",
                        "telefono": "60605939",

                        "correo": "hmcirujanoplastico@gmail.com",

            "codEstableMH": None,
            "codEstable": None,
            "codPuntoVentaMH": None,
            "codPuntoVenta": None
        },

        "documento": {
            "tipoDte": "01",
            "codigoGeneracion": codigoGeneracion[iteration],
            "selloRecibido": selloRecibido[iteration],
            "numeroControl": numeroControl[iteration],
            "fecEmi": current_date,
            "montoIva": 391.15,
            "codigoGeneracionR": None,
            "tipoDocumento": "13",
            "numDocumento": "06384275-4",
            "nombre": "Luis Hernandez",
            "telefono": "64319239",
            "correo": "luishdezmtz12@gmail.com"
        },
        "motivo": {
            "tipoAnulacion": 2,
            "motivoAnulacion": "Error en los datos del documento",
            "nombreResponsable": "HM Clínic S.A de C.V",
            "tipDocResponsable": "36",
            "numDocResponsable": NIT,
            "nombreSolicita": "HM Clínic S.A de C.V",
            "tipDocSolicita": "36",
            "numDocSolicita": NIT
        }
    }
        }

        # STEP 1: Send firm data to the first endpoint
        print(f"STEP 1: Sending firm data to get signature for document {current_number}...")
        try:
            response1 = requests.post(
                "https://www.myspaceai.cloud/port444/",
                headers={'Content-Type': 'application/json'},
                json=firm_data
            )
            response1.raise_for_status()  # Raise an exception for 4XX/5XX responses
            
            # Parse the JSON response
            firm_result = response1.json()
            """ print(f"Signature Response: {json.dumps(firm_result, indent=2)}") """
            
            # Check if the response has a body field (the signature)
            if 'body' not in firm_result or not firm_result['body']:
                print("Error: No signature found in the response")
                continue  # Skip to next iteration
            
            # Create the plantilla for step 3
            # First, make a copy of the original data
            plantilla = firm_data.copy()
            # Add the firma to the dteJson
            plantilla['dteJson']['firma'] = firm_result['body']
            
        except requests.exceptions.RequestException as e:
            print(f"Error in step 1: {e}")
            continue  # Skip to next iteration

        # STEP 2: Login to get token
        print("\nSTEP 2: Logging in to get authorization token...")
        
        try:
            # Prepare form data
            body = urllib.parse.urlencode({
                'user': NIT,
                'pwd': CODIGO_HACIENDA,
                'source': 'MysoftwareSv'
            })
            
            response2 = requests.post(
                "https://apitest.dtes.mh.gob.sv/seguridad/auth",
                headers={
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'MysoftDTE'
                },
                data=body
            )
            response2.raise_for_status()
            
            # Parse the JSON response
            login_result = response2.json()
            """ print(f"Login Response: {json.dumps(login_result, indent=2)}") """
            
            # Extract token from the response
            if 'body' not in login_result or 'token' not in login_result['body']:
                print("Error: No token found in the login response")
                continue  # Skip to next iteration
            
            token = login_result['body']['token']

            if token.startswith("Bearer "):
                token = token[7:]    
        except requests.exceptions.RequestException as e:
            print(f"Error in step 2: {e}")
            continue  # Skip to next iteration
        

        # STEP 3: Send the bill
        print("\nSTEP 3: Sending bill with authorization token...")
        try:
            # Format the data as shown in the example
            bill_data = {
                "ambiente": plantilla["dteJson"]["identificacion"]["ambiente"],
                "idEnvio": 3,  # This might need to be dynamic
                "version": plantilla["dteJson"]["identificacion"]["version"],
                "documento": plantilla["dteJson"]["firma"]
            }

            response3 = requests.post(
                "https://apitest.dtes.mh.gob.sv/fesv/anulardte",
                headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json',
                    'User-Agent': 'MysoftDTE'
                },
                json=bill_data
            )

            # Print the response content even if status code is error
            try:
                error_content = response3.json()
                print(f"Response content: {json.dumps(error_content, indent=2)}")
            except json.JSONDecodeError:
                print(f"Response content (not JSON): {response3.text}")

            # Now raise for status to trigger exception handling
            response3.raise_for_status()

            # If we get here, process successful response
            bill_result = response3.json()
            
            # Check if the bill was accepted
            if 'estado' in bill_result:
                print(f"Bill submission status: {bill_result['estado']}")
                if bill_result['estado'] == 'PROCESADO':
                    print(f"Success: The bill {current_number} was successfully processed")
                else:
                    print(f"Warning: The bill {current_number} was not successfully processed")
                    if 'descripcionMsg' in bill_result:
                        print(f"Reason: {bill_result['descripcionMsg']}")
            else:
                print("Unknown response format from bill submission")

        except requests.exceptions.RequestException as e:
            print(f"Error in step 3: {e}")
            # Continue to next iteration even if there's an error
        
        # Update the counter for the next run
        current_number += 1
        
        # Add a small delay to avoid overwhelming the API
        time.sleep(1)

if __name__ == "__main__":
    main()