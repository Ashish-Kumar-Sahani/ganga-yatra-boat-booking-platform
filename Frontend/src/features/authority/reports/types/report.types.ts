import type { Boat } from "../../boats/types/boat.types";
import type { Permit } from "../../permits/types/permit.types";
import type { Route } from "../../routes/types/route.types";
import type { Inspection } from "../../inspections/types/inspection.types";
import type { Violation } from "../../violations/types/violation.types";
import type { Complaint } from "../../complaints/types/complaint.types";

export interface AuthorityReportsSummary {
  boats: Boat[];
  permits: Permit[];
  routes: Route[];
  inspections: Inspection[];
  violations: Violation[];
  complaints: Complaint[];
}
