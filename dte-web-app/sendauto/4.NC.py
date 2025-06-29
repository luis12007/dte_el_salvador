import requests
import json
import urllib.parse
import uuid
import time
from datetime import datetime

""" INFO DE Luis """
NIT = "02101601741065"  # Replace with your actual NIT
PASSWORD_PRI = "Halogenados20242"  # Replace with your actual password
CODIGO_HACIENDA = "M{Opt4$roCo"  # Replace with your actual code
STARTING_NUMBER = 550  # Starting number for the numeroControl
NUM_ITERATIONS = 100  # Number of times to run the script
CODACTIVITY = "86203"  # Replace with your actual activity code
NRC = "1837811"  # Replace with your actual NRC

def main():
    current_number = STARTING_NUMBER
    
    for iteration in range(NUM_ITERATIONS):
        print(f"\n===== ITERATION {iteration+1}/{NUM_ITERATIONS} =====")
        
                # Update current date and time
        current_date = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")

        # Generate a new UUID for codigoGeneracion
        new_codigo_generacion = str(uuid.uuid4()).upper()
        reference_code = "0E50FDA3-F270-4A40-85C9-B09256C86651"
        reference_date = current_date

        # Update the numeroControl with the current number
        numero_control = f"DTE-05-00000000-000000000000{current_number}"
        

        
        # Define the JSON data to send in the first call
        firm_data = {
            "nit": NIT,
            "activo": True,
            "passwordPri": PASSWORD_PRI,
            "dteJson": {
                "identificacion": {
                    "version": 3,
                    "ambiente": "00",
                    "tipoDte": "05",
                    "numeroControl": numero_control,
                    "codigoGeneracion": new_codigo_generacion,
                    "tipoModelo": 1,
                    "tipoOperacion": 1,
                    "fecEmi": current_date,
                    "horEmi": current_time,
                    "tipoMoneda": "USD",
                    "tipoContingencia": None,
                    "motivoContin": None
                },
                "documentoRelacionado": [
            {
                "tipoDocumento": "03",
                "tipoGeneracion": 1,
                "numeroDocumento": reference_code,
                "fechaEmision": reference_date
            }
        ],
                "emisor": {
                    "direccion": {
                        "municipio": "14",
                        "departamento": "06",
                        "complemento": " Final Paseo General Escalón #B-2, Colonia Escalón. San Salvador."
                    },
                    "nit": NIT,
                    "nrc": NRC,
                    "nombre": "HM Clínic S.A de C.V",
                    "codActividad": CODACTIVITY,
                    "descActividad": "Clínicas médicas",
                    "telefono": "60605939",
                    "correo": "administracion@hmclinicsv.com",
                    "nombreComercial": "Centro de cirugía ambulatoria.",
                    "tipoEstablecimiento": "02",
                },
                "receptor": {
            "nit": "02101601741065",
            "nrc": "1837811",
            "nombre": "Luis Hernandez",
            "codActividad": "86203",
            "descActividad": "Servicios de medicos",
            "nombreComercial": None,
            "direccion": {
                        "municipio": "14",
                        "departamento": "06",
                        "complemento": " Final Paseo General Escalón #B-2, Colonia Escalón. San Salvador."
                    },
            "correo": "luishdezmtz12@gmail.com",
            "telefono": None
        },
                "ventaTercero": None,
                "cuerpoDocumento": [
            {
                "codTributo": None,
                "descripcion": "2",
                "uniMedida": 99,
                "codigo": None,
                "cantidad": 2,
                "numItem": 1,
                "tributos": [
                    "20"
                ],
                "montoDescu": 0,
                "numeroDocumento": reference_code,
                "precioUni": 1.77,
                "ventaGravada": 3.54,
                "ventaExenta": 0,
                "ventaNoSuj": 0,
                "tipoItem": 1
            }
        ],
                "resumen": {
            "totalNoSuj": 0,
            "totalExenta": 0,
            "totalGravada": 3.54,
            "subTotalVentas": 3.54,
            "descuNoSuj": 0,
            "descuExenta": 0,
            "totalDescu": 0,
            "tributos": [
                {
                    "codigo": "20",
                    "descripcion": "Impuesto al Valor Agregado 13%",
                    "valor": 0.46
                }
            ],
            "subTotal": 3.54,
            "ivaPerci1": 0,
            "ivaRete1": 0,
            "reteRenta": 0,
            "montoTotalOperacion": 4,
            "totalLetras": "CUATRO DÓLARES",
            "condicionOperacion": 1,
            "descuGravada": 0
        },
        "extension": {
            "docuEntrega": None,
            "nombRecibe": None,
            "observaciones": "",
            "nombEntrega": None,
            "docuRecibe": None
        },
        "apendice": None,
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
                "tipoDte": plantilla["dteJson"]["identificacion"]["tipoDte"],
                "ambiente": plantilla["dteJson"]["identificacion"]["ambiente"],
                "idEnvio": 3,  # This might need to be dynamic
                "version": plantilla["dteJson"]["identificacion"]["version"],
                "codigoGeneracion": plantilla["dteJson"]["identificacion"]["codigoGeneracion"],
                "documento": plantilla["dteJson"]["firma"]
            }

            response3 = requests.post(
                "https://apitest.dtes.mh.gob.sv/fesv/recepciondte",
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