import os

from flask.cli import FlaskGroup

from app import create_app, db
from app.user.model import User
from app.profile.model import Profile

env = os.getenv("FLASK_ENV") or "test"
print(f"Active environment: * {env} *")
app = create_app(env)

cli = FlaskGroup(app)


@cli.command("create_db")
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command("seed_profiles")
def seed_profiles():
    db.session.add(
        Profile(
            company_name="E-Shop",
            industry="ECOMMERCE",
            region="EUROPE",
            business_value=5000000,
            number_of_employees=10000,
            employee_training=1,
            budget=50000,
            budget_weight=1,
            invested_amount=130000,
            known_vulnerabilities=2,
            external_advisor=False,
            successful_attacks=4,
            failed_attacks=15,
            user_id=1,
        )
    )
    db.session.add(
        Profile(
            company_name="Bank X",
            industry="FINANCIAL SERVICES",
            region="NORTH AMERICA",
            business_value=36000000,
            number_of_employees=70000,
            employee_training=1,
            budget=750000,
            budget_weight=1,
            invested_amount=500000,
            known_vulnerabilities=0,
            external_advisor=False,
            successful_attacks=2,
            failed_attacks=15,
            user_id=1,
        )
    )
    db.session.add(
        Profile(
            company_name="Company XY",
            industry="HEALTHCARE",
            region="EUROPE",
            business_value=4947796,
            number_of_employees=57879,
            employee_training=3,
            budget=50000,
            budget_weight=1,
            invested_amount=1077113,
            known_vulnerabilities=6,
            external_advisor=True,
            successful_attacks=8,
            failed_attacks=29,
            user_id=1,
        )
    )
    db.session.commit()


@cli.command("seed_db")
def seed_db():
    db.session.add(User(email="admin@mail.com"))
    db.session.commit()


if __name__ == "__main__":
    cli()
