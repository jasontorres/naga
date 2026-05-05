export const getAllowedFieldsForDomain = (table: string) => {
  switch (table) {
    case "clusters":
      return [
        "id",
        "description",
        "name",
        "offices",
        "paps_count",
        "subtitle",
        "theme",
        "title",
        "total",
        "year",
      ];
    case "agencies":
      return [
        "id",
        "abbreviation",
        "cluster_id",
        "description",
        "title",
        "year",
      ];
    case "programs":
      return [
        "id",
        "agency_id",
        "aip_reference_code",
        "description",
        "implementation_start",
        "implementation_end",
        "name",
      ];
    case "amounts":
      return ["id", "amount", "category", "program_id"];
    default:
      return [];
  }
};
