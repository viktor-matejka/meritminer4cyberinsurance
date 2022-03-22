from flask_restx import Namespace, Resource
from flask_accepts import accepts, responds
from flask import request

from app.helper.schema import BaseSchema

from .service import DashboardService
from .schema import (
    UnderwritingSchema,
    UnderwritingInfoSchema,
    PolicySchema,
    PolicyInfoSchema,
    RiskSchema,
    RiskInfoSchema,
    CoverageSchema,
    CoverageInfoSchema,
    ConfidenceFactorSchema,
    ConfidenceFactorInfoSchema,
    DashboardShema,
    DashboardDataShema,
)


api = Namespace("Dashboard")

policy_filter = api.parser()
policy_filter.add_argument("underwritingId", help='Policy id for filtering')

risks_filter = api.parser()
risks_filter.add_argument("policyId", help="List polisy id (Ex: [1,2,3])")

coverages_filter = api.parser()
coverages_filter.add_argument("policyId", help="List polisy id (Ex: [1,2,3])")

factor_filter = api.parser()
factor_filter.add_argument("coverageId", help="List coverage id (Ex: [1,2,3])")

profile_filter = api.parser()
profile_filter.add_argument("profileId", help="Profile ID")

dashboard_filter = api.parser()
dashboard_filter.add_argument("processId", help="Process id for filtering")


@api.route("summary/")
class DashboardResource(Resource):
    """Discovery Eventlog"""

    @api.expect(profile_filter)
    @responds(schema=DashboardShema, api=api)
    def get(self):
        """Get Single Eventlog"""

        profile_id = profile_filter.parse_args().get("profileId")
        return DashboardService.get_by_id(profile_id)


@api.route("underwritings/")
class UnderwritingResource(Resource):
    """Underwriting Resource"""

    @responds(schema=UnderwritingInfoSchema(many=True), api=api)
    def get(self):
        """Get all Underwritings"""

        return DashboardService.get_underwritings()

    @accepts(schema=UnderwritingSchema, api=api)
    @responds(schema=UnderwritingInfoSchema, api=api)
    def post(self):
        """Create Underwriting"""

        return DashboardService.post_analysis(request.parsed_obj)


@api.route("underwritings/<int:underwritingId>")
@api.param("underwritingId", "Underwriting database ID")
class UnderwritingIdResource(Resource):
    @responds(schema=UnderwritingInfoSchema, api=api)
    def get(self, underwritingId):
        """Get single Underwriting"""

        return DashboardService.get_analysis_by_id(underwritingId)

    # @responds(schema=UnderwritingInfoSchema, api=api)
    # def delete(self, underwritingId):
    #     """Delete Underwriting"""

    #     return DashboardService.delete_analysis(underwritingId), 201

    @accepts(schema=UnderwritingSchema, api=api)
    @responds(schema=UnderwritingInfoSchema, api=api)
    def put(self, underwritingId):
        """Update Underwriting"""

        return DashboardService.update_underwriting(
            underwritingId,
            request.parsed_obj,
        )


@api.route("policies/")
class Policies(Resource):
    """Policy"""

    @api.expect(policy_filter)
    @responds(schema=PolicyInfoSchema(many=True), api=api)
    def get(self):
        """Get all the Policies or filter through the assessment id"""

        underwriting_id = policy_filter.parse_args().get("underwritingId")
        return DashboardService.get_policies(underwriting_id)

    @accepts(schema=PolicySchema, api=api)
    @responds(schema=PolicyInfoSchema, api=api)
    def post(self):
        """Create Policy"""

        return DashboardService.post_policy(request.parsed_obj)


@api.route("policies/<int:policyId>")
@api.param("policyId", "Policy database ID")
class PolicyIdResource(Resource):
    """Policy Id"""

    @responds(schema=PolicyInfoSchema, api=api)
    def get(self, policyId: int):
        """Get Single Polisy"""

        return DashboardService.get_policy_by_id(policyId)

    @responds(schema=BaseSchema, api=api)
    def delete(self, policyId):
        """Delete Single Polisy"""

        return DashboardService.delete_policy(policyId)

    @accepts(schema=PolicySchema, api=api)
    @responds(schema=PolicyInfoSchema, api=api)
    def put(self, policyId: int):
        """Update Single Polisy"""

        return DashboardService.update_policy(policyId, request.parsed_obj)


@api.route("risks/")
class RisksResource(Resource):
    """Risk Resource"""

    @api.expect(risks_filter)
    @responds(schema=RiskInfoSchema(many=True), api=api)
    def get(self):
        """Get all Risks"""

        policy_id = risks_filter.parse_args().get("policyId")
        return DashboardService.get_risks(policy_id)

    @accepts(schema=RiskSchema, api=api)
    @responds(schema=RiskInfoSchema, api=api)
    def post(self):
        """Create Risk"""

        return DashboardService.create_risk(request.parsed_obj)


@api.route("risks/<int:riskId>")
@api.param("riskId", "Risk database ID")
class RiskIdResource(Resource):
    """Risk Id Resource"""

    @responds(schema=RiskInfoSchema, api=api)
    def get(self, riskId):
        """Get Single Risk"""
        return DashboardService.get_risk_by_id(riskId)

    @responds(schema=BaseSchema, api=api)
    def delete(self, riskId):
        """Delete Single Risk"""
        return DashboardService.delete_risk(riskId)

    @accepts(schema=RiskSchema, api=api)
    @responds(schema=RiskInfoSchema, api=api)
    def put(self, riskId):
        """Update Single Risk"""

        return DashboardService.update_risk(riskId, request.parsed_obj)


@api.route("coverages/")
class Coverages(Resource):
    """Coverage Resource"""

    @api.expect(coverages_filter)
    @responds(schema=CoverageInfoSchema(many=True), api=api)
    def get(self):
        """Get all Coverages"""

        policy_id = risks_filter.parse_args().get("policyId")
        return DashboardService.get_coverages(policy_id)

    @accepts(schema=CoverageSchema, api=api)
    @responds(schema=CoverageInfoSchema, api=api)
    def post(self):
        """Create Coverage"""

        return DashboardService.create_coverage(request.parsed_obj)


@api.route("coverage/<int:coverageId>")
@api.param("coverageId", "Coverage database ID")
class CoverageIdResource(Resource):
    """Coverage Id Resource"""

    @responds(schema=CoverageInfoSchema, api=api)
    def get(self, coverageId):
        """Get Single Coverage"""

        return DashboardService.get_coverage_by_id(coverageId)

    @responds(schema=BaseSchema, api=api)
    def delete(self, coverageId):
        """Delete Single Coverage"""
        return DashboardService.delete_coverage(coverageId)

    @accepts(schema=CoverageSchema, api=api)
    @responds(schema=CoverageInfoSchema, api=api)
    def put(self, coverageId):
        """Update Single Coverage"""

        return DashboardService.update_coverage(coverageId, request.parsed_obj)


@api.route("confidence-factors/")
class ConfidenceFactorsResource(Resource):
    """Confidence Factors Resource"""

    @api.expect(factor_filter)
    @responds(schema=ConfidenceFactorInfoSchema(many=True), api=api)
    def get(self):
        """Get all ConfidenceFactors"""

        coverage_id = factor_filter.parse_args().get("coverageId")
        return DashboardService.get_confidence_factors(coverage_id)

    @accepts(schema=ConfidenceFactorSchema, api=api)
    @responds(schema=ConfidenceFactorInfoSchema, api=api)
    def post(self):
        """Create ConfidenceFactors"""

        return DashboardService.post_confidence_factor(request.parsed_obj)


@api.route("confidence-factors/<int:factorId>")
@api.param("factorId", "Confidence Factor database ID")
class ConfidenceFactorIdResource(Resource):
    """Confidence Factor Id Resource"""

    @responds(schema=ConfidenceFactorInfoSchema, api=api)
    def get(self, factorId):
        """Get Single Confidence Factor"""
        return DashboardService.get_confidence_factor_by_id(factorId)

    @responds(schema=BaseSchema, api=api)
    def delete(self, factorId):
        """Delete Single Confidence Factor"""
        return DashboardService.delete_confidence_factor(factorId)

    @accepts(schema=ConfidenceFactorSchema, api=api)
    @responds(schema=ConfidenceFactorInfoSchema, api=api)
    def put(self, factorId):
        """Update Single Confidence Factor"""
        return DashboardService.update_confidence_factor(
            factorId,
            request.parsed_obj,
        )


@api.route("dashboard/")
class DashboardResourse(Resource):
    """Get dashoboard info"""

    @api.expect(dashboard_filter)
    @responds(schema=DashboardDataShema, api=api)
    def get(self):
        """Get dashoboard info"""

        process_id = dashboard_filter.parse_args().get("processId")
        return DashboardService.get_dashboar_info(process_id)
