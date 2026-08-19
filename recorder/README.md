# Recorder

## Installation et configuration Raspberry Pi

1. Ouvrez un nouveau terminal.
2. Tapez la commande `alsamixer` et appuyez sur Entrée.
3. Appuyez sur la touche **F6** pour sélectionner votre carte son "MAYA44 USB+".
4. Appuyez sur la touche **F4** pour afficher les contrôles de capture/enregistrement.
5. Vérifiez les niveaux. Utilisez les flèches haut/bas pour augmenter le volume. Si un canal est muet, il sera indiqué par "MM". Appuyez sur la touche **M** pour l'activer (il devrait passer à "OO").

### Ajouter le serveur SFTP à la liste des hôtes connus

Lancer la commande suivante dans le terminal pour se connecter au serveur SFTP et ajouter l'hôte à la liste des hôtes connus :
`sftp -P 22 SBI-JG891504@sftp.swiss-backup04.infomaniak.com`

```bash
The authenticity of host 'sftp.swiss-backup04.infomaniak.com (185.125.24.38)' can't be established.
RSA key fingerprint is SHA256:xRU5RakUZ/yJYg3CDi9JiSRymodbPgM4S3FXvVHqK2s.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'sftp.swiss-backup04.infomaniak.com' (RSA) to the list of known hosts.
```

### Autres commandes utiles

`arecord -l` Pour voir tous les dispositif sur ma machine

`pavucontrol` pour mettre par défaut un périphérique ou voir si il est bien détecter

## Installation sur MacOS

`brew install portaudio`

## Python script & environnement virtuel

`python3 -m venv .venv` pour créer un environnement virtuel

`source .venv/bin/activate.fish` pour activer l'environnement virtuel

`pip3 install -r requirements.txt` pour installer les dépendances

`python3 main.py` pour lancer le script principal

`deactivate` pour désactiver l'environnement virtuel
