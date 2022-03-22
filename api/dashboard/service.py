from email import policy
from typing import Dict, List
from attr import attributes
from flask import jsonify
from ..utils.conformance_checking import ltl_checker

from app import db
from app.eventlog.model import Eventlog

from ..user.model import User
from ..discovery.model import Discovery, Statistic
from .model import ConfidenceFactor, Coverage, Policy, Risk, Underwriting
from ..conformance.model import LTLRule

from pm4py.objects.log.importer.xes.variants.iterparse import (
    import_from_string as xes_importer,
)
from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.algo.evaluation.replay_fitness import algorithm as replay_fitness_evaluator


class DashboardService:
    @staticmethod
    def get_by_id(profile_id: int) -> Dict[str, str]:
        eventlogs = Eventlog.query.filter(
            Eventlog.profile_id == profile_id,
        ).all()

        if not eventlogs:
            return {"data": None}

        uploaded_eventlogs = len(eventlogs)
        discoveries = Discovery.query.count()
        statistics = Statistic.query.all()
        risks = Risk.query.all()

        risk_sum = 0
        for item in risks:
            risk_sum += item.rating

        risk_result = risk_sum / len(risks)

        fitness_num = 0
        for item in statistics:
            fitness_num += item.fitness

        cases_num = 0
        events_num = 0
        for item in statistics:
            if item.number_of_cases:
                cases_num += item.number_of_cases
            if item.number_of_events:
                events_num += item.number_of_events

        data = [
            {"key": "Uploaded Eventlogs", "value": str(uploaded_eventlogs)},
            {"key": "Discovered processes", "value": str(discoveries)},
            {"key": "Analysed cases", "value": str(cases_num)},
            {"key": "Analysed events", "value": str(events_num)},
            {"key": "Overall conformance", "value": str(fitness_num)},
            {"key": "Enterprise risk modifier", "value": str(risk_result)},
        ]

        return {"data": data}

    @staticmethod
    def get_underwritings():
        analysises = db.session.query(Underwriting).all()

        return analysises

    @staticmethod
    def post_analysis(args) -> Underwriting:
        new_underwriting = Underwriting(
            assessment_name=args.get("assessment_name"),
            profile_id=args.get("profile_id"),
            user_id=User.query.first().id,
            eventlog_id=args.get("eventlog_id"),
        )

        db.session.add(new_underwriting)
        db.session.commit()

        return new_underwriting

    @staticmethod
    def get_analysis_by_id(analysis_id):
        analysis = Underwriting.query.get(analysis_id)
        return analysis

    @staticmethod
    def delete_analysis(analysis_id):
        analysis = Underwriting.query.get(analysis_id)
        return analysis

    @staticmethod
    def update_underwriting(underwriting_id, update_data):
        underwriting = db.session.query(Underwriting).get(underwriting_id)

        underwriting.assessment_name = update_data.get("assessment_name")
        underwriting.customer_id = update_data.get("customer_id")
        underwriting.user_id = User.query.first().id
        underwriting.eventlog_id = update_data.get("eventlog_id")

        db.session.commit()
        return underwriting

    @staticmethod
    def get_risks(policy_id: List[int]):
        if policy_id:
            id_list = policy_id.split(",")
            risks = (
                db.session.query(Risk)
                .filter(
                    Risk.policy_id.in_(id_list),
                )
                .all()
            )
        else:
            risks = db.session.query(Risk).all()
        return risks

    @staticmethod
    def create_risk(args):
        risk = Risk(
            name=args["name"],
            rating=args["rating"],
            policy_id=args["policy_id"],
        )

        db.session.add(risk)
        db.session.commit()
        return risk

    @staticmethod
    def get_risk_by_id(risk_id):
        risk = Risk.query.get(risk_id)
        return risk

    @staticmethod
    def delete_risk(risk_id):
        risk = db.session.query(Risk).get(risk_id)
        db.session.delete(risk)
        db.session.commit()
        return {"success": True, "message": "Risk deleted"}

    @staticmethod
    def update_risk(risk_id, update_data):
        risk = Risk.query.get(risk_id)

        risk.name = update_data.get("name")
        risk.rating = update_data.get("rating")
        risk.policy_id = update_data.get("policy_id")

        db.session.commit()
        return risk

    # @staticmethod
    # def get_risk_modifier_by_id(risk_id):
    #     risk_md = RiskModifier.query.get(risk_id)
    #     return risk_md

    # @staticmethod
    # def delete_risk_modifier(risk_id):
    #     risk_md = db.session.query(RiskModifier).get(risk_id)
    #     db.session.delete(risk_md)
    #     db.session.commit()
    #     return {"success": True, "message": "Risk Modifier deleted"}

    # @staticmethod
    # def update_risk_modifier(risk_id, update_data):
    #     risk_md = RiskModifier.query.get(risk_id)

    #     risk_md.name = update_data.get("name")
    #     risk_md.rating = update_data.get("rating")
    #     risk_md.policy_id = update_data.get("policy_id")

    #     db.session.commit()
    #     return risk_md

    # @staticmethod
    # def get_risk_modifiers(policy_id: List[int]):
    #     if policy_id:
    #         id_list = policy_id.split(",")
    #         risk_mod = (
    #             db.session.query(RiskModifier)
    #             .filter(RiskModifier.policy_id.in_(id_list))
    #             .all()
    #         )
    #     else:
    #         risk_mod = db.session.query(RiskModifier).all()
    #     return risk_mod

    # @staticmethod
    # def create_risk_modifier(args):
    #     risk_mod = RiskModifier(
    #         name=args["name"],
    #         rating=args["rating"],
    #         policy_id=args["policy_id"],
    #     )

    #     db.session.add(risk_mod)
    #     db.session.commit()
    #     return risk_mod

    @staticmethod
    def get_policies(underwriting_id: int) -> List[Policy]:
        if underwriting_id:
            policies = (
                db.session.query(Policy)
                .filter(Policy.underwriting_id == underwriting_id)
                .all()
            )
        else:
            policies = db.session.query(Policy).all()
        return policies

    @staticmethod
    def post_policy(args):
        policy = Policy(
            name=args["name"],
            insurer_name=args["insurer_name"],
            inssurer_id=args["inssurer_id"],
            description=args["description"],
            underwriting_id=args["underwriting_id"],
        )

        db.session.add(policy)

        db.session.commit()

        return policy

    @staticmethod
    def get_policy_by_id(policy_id):
        policy = Policy.query.get(policy_id)
        return policy

    @staticmethod
    def delete_policy(policy_id):
        policy = db.session.query(Policy).get(policy_id)
        db.session.delete(policy)
        db.session.commit()
        return {"success": True, "message": "Polisy deleted"}

    @staticmethod
    def update_policy(policy_id, update_data):
        policy = Policy.query.get(policy_id)
        policy.name = update_data.get("name")
        policy.inssurer_id = update_data.get("inssurer_id")
        policy.description = update_data.get("description")
        policy.underwriting_id = update_data.get("underwriting_id")

        db.session.commit()
        return policy

    @staticmethod
    def get_coverages(policy_id: int) -> Coverage:
        if policy_id:
            id_list = policy_id.split(",")
            coverages = (
                db.session.query(Coverage)
                .filter(
                    Coverage.policy_id.in_(id_list),
                )
                .all()
            )
        else:
            coverages = db.session.query(Coverage).all()
        return coverages

    @staticmethod
    def create_coverage(args):
        coverage = Coverage(
            name=args["name"],
            description=args["description"],
            policy_id=args["policy_id"],
        )

        db.session.add(coverage)
        db.session.commit()

        return coverage

    @staticmethod
    def get_coverage_by_id(coverage_id):
        coverage = Coverage.query.get(coverage_id)
        return coverage

    @staticmethod
    def delete_coverage(coverage_id):
        coverage = db.session.query(Coverage).get(coverage_id)
        db.session.delete(coverage)
        db.session.commit()
        return coverage

    @staticmethod
    def update_coverage(coverage_id, update_data):
        coverage = Coverage.query.get(coverage_id)

        coverage.name = update_data.get("name")
        coverage.description = update_data.get("description")
        coverage.policy_id = update_data.get("policy_id")

        db.session.commit()
        return coverage

    @staticmethod
    def get_confidence_factors(coverage_id):
        if coverage_id:
            id_list = coverage_id.split(",")
            confidence_factors = (
                db.session.query(ConfidenceFactor)
                .filter(ConfidenceFactor.coverage_id.in_(id_list))
                .all()
            )
        else:
            confidence_factors = db.session.query(ConfidenceFactor).all()
        return confidence_factors

    @staticmethod
    def post_confidence_factor(args):
        confidence_factor = ConfidenceFactor(
            name=args["name"],
            description=args["description"],
            rating=args["rating"],
            coverage_id=args["coverage_id"],
        )

        db.session.add(confidence_factor)
        db.session.commit()
        return confidence_factor

    @staticmethod
    def get_confidence_factor_by_id(factor_id):
        confidence_factor = ConfidenceFactor.query.get(factor_id)
        return confidence_factor

    @staticmethod
    def delete_confidence_factor(factor_id):
        confidence_factor = db.session.query(ConfidenceFactor).get(factor_id)
        db.session.delete(confidence_factor)
        db.session.commit()
        return {"success": True, "message": "Polisy deleted"}

    @staticmethod
    def update_confidence_factor(factor_id, update_data):
        confidence_factor = ConfidenceFactor.query.get(factor_id)

        confidence_factor.name = update_data.get("name")
        confidence_factor.description = update_data.get("description")
        confidence_factor.rating = update_data.get("rating")
        confidence_factor.coverage_id = update_data.get("coverage_id")
        db.session.commit()
        return confidence_factor

    @staticmethod
    def get_dashboar_info(process_id: int):

        eventlogs = Eventlog.query.filter(Eventlog.process_id == process_id).all()

        eventlogs_id = []
        for item in eventlogs:
            eventlogs_id.append(item.id)
            print(item.id)

        statistics = Statistic.query.filter(Statistic.eventlog_id.in_(eventlogs_id))

        fitness_sum = 0
        fitness_count = 0
        for item in statistics:
            fitness_count += 1
            fitness_sum += item.fitness

        if fitness_count == 0:
            overall_fitness = 0
        else:
            overall_fitness = round(fitness_sum / fitness_count, 2)

        underwritings = db.session.query(Underwriting).filter(
            Underwriting.eventlog_id.in_(eventlogs_id)
        )

        underwritings_id = []
        for item in eventlogs:
            underwritings_id.append(item.id)

        policies = db.session.query(Policy).filter(
            Policy.underwriting_id.in_(underwritings_id)
        )

        policies_id = []
        for item in policies:
            policies_id.append(item.id)

        risks = db.session.query(Risk).filter(Risk.policy_id.in_(policies_id)).all()
        coverages = (
            db.session.query(Coverage).filter(Coverage.policy_id.in_(policies_id)).all()
        )
        ltl_rules = DashboardService.get_ltl_for_dasboard(eventlogs_id)

        return {
            "overallFitness": overall_fitness,
            "risks": risks,
            "coverages": coverages,
            "ltlRules" : ltl_rules
        }

    @staticmethod
    def get_ltl_for_dasboard(eventlogs_id):
        if eventlogs_id == []:
            return []
        ltl_rules = LTLRule.query.filter(LTLRule.eventlog_id.in_(eventlogs_id))

        result = []
        for item in ltl_rules:
            el = Eventlog.query.get(item.eventlog_id)
            log = xes_importer(el.file)
            rule = item.rule
            attributes = item.source_inssurer
            log = ltl_checker(log, rule, attributes)
            net, im, fm = inductive_miner.apply(log)
            fitness = replay_fitness_evaluator.apply(
                log,
                net,
                im,
                fm,
                variant=replay_fitness_evaluator.Variants.ALIGNMENT_BASED,
            )
            temp = {"rule": item.name, "fitness": fitness.get("percFitTraces")}
            result.append(temp)
        return result
