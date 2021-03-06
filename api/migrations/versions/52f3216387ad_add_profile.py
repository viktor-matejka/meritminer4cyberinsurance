"""add profile

Revision ID: 52f3216387ad
Revises: e673da2a0c48
Create Date: 2022-03-15 08:58:41.242404

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '52f3216387ad'
down_revision = 'e673da2a0c48'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('profile',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('company_name', sa.String(length=128), nullable=False),
    sa.Column('industry', sa.String(length=128), nullable=False),
    sa.Column('region', sa.String(length=128), nullable=False),
    sa.Column('business_value', sa.Integer(), nullable=True),
    sa.Column('number_of_employees', sa.Integer(), nullable=False),
    sa.Column('employee_training', sa.Integer(), nullable=False),
    sa.Column('budget', sa.Integer(), nullable=True),
    sa.Column('budget_weight', sa.Integer(), nullable=False),
    sa.Column('invested_amount', sa.Integer(), nullable=True),
    sa.Column('known_vulnerabilities', sa.Integer(), nullable=True),
    sa.Column('external_advisor', sa.Boolean(), server_default='false', nullable=True),
    sa.Column('successful_attacks', sa.Integer(), nullable=True),
    sa.Column('failed_attacks', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('edited_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('company_name')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('profile')
    # ### end Alembic commands ###
