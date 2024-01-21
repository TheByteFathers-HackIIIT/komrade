from cas import CASClient
cas_client = CASClient(
    version=3,
    service_url="http://127.0.0.1:5000/login/?next=/menu",
    server_url='https://login.iiit.ac.in/cas/'
)
print(cas_client.get_login_url())
ticket = input("Put ticket nigga: ")
print(cas_client.verify_ticket(ticket))