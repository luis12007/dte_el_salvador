import requests
import json
import urllib.parse
import uuid
import time
from datetime import datetime

""" INFO DE Gineco """
NIT = "95010105731016"  # Replace with your actual NIT
PASSWORD_PRI = "Fractura4"  # Replace with your actual password
CODIGO_HACIENDA = "M{Opt4$roCo"  # Replace with your actual code
STARTING_NUMBER = 250  # Starting number for the numeroControl
NUM_ITERATIONS = 100  # Number of times to run the script
CODACTIVITY = "86203"  # Replace with your actual activity code
NRC = "1868980"  # Replace with your actual NRC

def main():
    current_number = STARTING_NUMBER
    
    for iteration in range(NUM_ITERATIONS):
        print(f"\n===== ITERATION {iteration+1}/{NUM_ITERATIONS} =====")
        
        # Generate a new UUID for codigoGeneracion
        new_codigo_generacion = str(uuid.uuid4()).upper()
        codigoGeneracion = ["455F3167-AE80-4BA3-8884-58A0F7E08F08","2F917681-070C-4193-8C7B-A44DD88A7795", "A1A08A49-CF76-4FC3-A2AB-6080A86BE21A", "DBF4C2EE-A07B-4B31-BCA4-FBEB9D293514", "4DCC6E89-93C4-407F-B657-B695FE410318", "562AE3A1-1BF1-462F-AC13-581D8BC7F27A"]
        selloRecibido = ["2025D4B1C5A989394AD6876A2786A358AA6FREL1","20254491D153446E418F90340990B17711F8BWFJ", "202520B770E876344B858E4404EEF65B2AA2GWQW", "2025D167C8374BCA456983FBA3CC16E112444HFT", "2025927A2CD21C994C2592C531703D54F2990FCW",  "20253D7A5B9DDA2F4657869EC9AFD7BDF78BJ8PI"]
        numeroControl = ["DTE-01-00000000-000000000000450","DTE-01-00000000-000000000000451", "DTE-01-00000000-000000000000452", "DTE-01-00000000-000000000000653", "DTE-01-00000000-000000000000253", "DTE-01-00000000-000000000000254"]

        
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