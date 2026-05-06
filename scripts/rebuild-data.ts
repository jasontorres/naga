import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import {
  metadataFactory,
  rollupFactory,
  dataQualityFactory,
  pageDataFactory,
} from "./lib/factories/index.js";
import { legacyAIPMetadata, EMPTY_ROLLUP } from "./lib/temp-data/index.js";
import { externalPromises } from "./lib/api/external/index.js";
import { buildSectorListFromClusterIds } from "./lib/factories/index.js";
import { sumRollups } from "./lib/util/calc.js";
import { Rollup } from "./lib/types/internal.js";

const main = async () => {
  const metadata = metadataFactory.params(legacyAIPMetadata).build();
  const rollup = rollupFactory.params(EMPTY_ROLLUP).build();
  const rollupCleanExcludingOutliers = rollupFactory
    .params(EMPTY_ROLLUP)
    .build();

  const dataQuality = dataQualityFactory
    .params({
      rows_total: 1216,
      rows_clean: 1194,
      missing_funding_source: 299,
      unit_check_outliers: 22,
      non_canonical_funding_source: 0,
    })
    .build();

  // NOTE: fetch all data upfront then filter each agency, program and amount per cluster_id
  const [agencies, programs, amounts] = await Promise.all(externalPromises);

  // NOTE: these sectors are provided by aip2026.json; ideally we pull directly from the clusters endpoint
  const economicSectorList = await buildSectorListFromClusterIds(
    "Economic",
    [5],
    agencies,
    programs,
    amounts,
  ); // economic

  const economicSectorRollups = economicSectorList.map(
    (sector) => sector.rollup,
  );

  const enviInfraHousingClusterList = await buildSectorListFromClusterIds(
    "Environment/Infrastructure/Housing",
    [7],
    agencies,
    programs,
    amounts,
  ); // envi_infra_urban_housing

  const enviInfraHousingRollups = enviInfraHousingClusterList.map(
    (sector) => sector.rollup,
  );

  const generalPublicServicesClusterList = await buildSectorListFromClusterIds(
    "General Public Services",
    [3, 6, 8],
    agencies,
    programs,
    amounts,
  ); // education, governance, healthy_naguenos

  const generalPublicServicesRollups = generalPublicServicesClusterList.map(
    (sector) => sector.rollup,
  );

  const socialSectorClusterIds = await buildSectorListFromClusterIds(
    "Social",
    [1, 2, 4],
    agencies,
    programs,
    amounts,
  ); // safe_secure_humane, social_protection_inclusion, culture_arts_heritage

  const socialRollups = generalPublicServicesClusterList.map(
    (sector) => sector.rollup,
  );

  const allSectors = [
    ...economicSectorList,
    ...enviInfraHousingClusterList,
    ...generalPublicServicesClusterList,
    ...socialSectorClusterIds,
  ];

  const allSectorRollups: Rollup[] = [
    ...economicSectorRollups,
    ...enviInfraHousingRollups,
    ...generalPublicServicesRollups,
    ...socialRollups,
  ];

  const pageDataRollup = sumRollups(allSectorRollups);

  const data = pageDataFactory
    .params({
      metadata,
      rollup: pageDataRollup,
      rollup_clean_excluding_outliers: rollupCleanExcludingOutliers,
      data_quality: dataQuality,
      sectors: allSectors,
    })
    .build();

  const fileName = "aip2026-new.json";
  const savePath = path.join("public", "data", fileName);

  fs.writeFileSync(savePath, JSON.stringify(data));
};

main().catch((e) => {
  console.error("Error with rebuilding data", e);
  process.exitCode = 1;
});
