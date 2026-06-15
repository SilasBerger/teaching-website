import api
import base64


CODIERTES_PASSWORT = "Q1RGe3N3b3JkZmlzaH0="


def main():
    ping = api.contact()
    if not ping:
        print('Error contacting API server - no response.')
        exit(1)
    success = api.login(base64.b64decode(CODIERTES_PASSWORT))
    if success:
        print('Login successful; authenticated')


if __name__ == "__main__":
    main()