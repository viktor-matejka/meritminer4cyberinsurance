"""add rework_rate to Statistic

Revision ID: 3467256f469b
Revises: 1f8c6ea0e81c
Create Date: 2022-03-16 19:39:22.228546

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3467256f469b'
down_revision = '1f8c6ea0e81c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('statistic', sa.Column('rework_rate', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('statistic', 'rework_rate')
    # ### end Alembic commands ###