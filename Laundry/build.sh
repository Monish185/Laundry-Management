set -o errexit

pip install -r Laundry/requirements.txt

python manage.py collectstatic --no-input

python manage.py makemigrations
python manage.py migrate

if [[ "$CREATE_SUPERUSER" == "true" ]]; then
    echo "Creating superuser..."
    python manage.py createsuperuser \
        --no-input \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL"
fi
