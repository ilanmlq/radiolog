#!/usr/bin/env python3
"""
Script pour générer un fichier JSON d'importation en masse Auth0
à partir d'un fichier CSV

Documentation Auth0: https://auth0.com/docs/manage-users/user-migration/bulk-user-import-schema
"""

import csv
import json
import hashlib
import secrets
from datetime import datetime

INPUT_VIEWER_CSV = 'students-hes-so.csv' # Viewer role
INPUT_ADMIN_CSV = 'students-etu.hesge.csv' # Admin role
ROLE = "viewer" # "viewer" ou "admin"
INPUT_CSV = INPUT_VIEWER_CSV
OUTPUT_JSON = 'auth0_import.json'

def parse_csv_to_auth0_json(csv_file, output_file):
    """
    Convertit le fichier CSV des étudiants en format JSON Auth0
    """
    users = []

    with open(csv_file, 'r', encoding='utf-8') as f:
        # Lire la première ligne pour détecter les en-têtes
        headers = f.readline().strip().split(',')
        print(f"En-têtes détectés: {headers}")

        # Déterminer les indices des colonnes
        etudiant_index = 1
        url_index = 2

        for line in f:
            parts = line.strip().split(',')
            if len(parts) < 3:
                continue

            name = parts[etudiant_index].strip()
            email = parts[url_index].strip()

            # Séparer le prénom et le nom
            name_parts = name.split(' ', 1)
            given_name = name_parts[0] if len(name_parts) > 0 else name
            family_name = name_parts[1] if len(name_parts) > 1 else ""

            # Créer l'objet utilisateur selon le schéma Auth0
            user = {
                "email": email,
                "email_verified": True,
                "given_name": given_name,
                "family_name": family_name,
                "name": name,
                "nickname": email.split('@')[0],
                "user_metadata": {},
                "app_metadata": {
                    "roles": [
                        ROLE
                    ],
                    "organisationId": 1
                },
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }

            users.append(user)

    # Écrire le fichier JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

    print(f"Fichier JSON généré avec succès: {output_file}")

def main():
    csv_file = INPUT_CSV
    output_file = OUTPUT_JSON

    try:
        parse_csv_to_auth0_json(csv_file, output_file)
    except FileNotFoundError:
        print(f"Erreur: Le fichier {csv_file} n'a pas été trouvé.")
    except Exception as e:
        print(f"Erreur lors de la génération: {str(e)}")

if __name__ == "__main__":
    main()
