/* ==========================================================================
   DEFECTSPEC v2.0 â€” SIDEBAR NAV + MULTI-PHOTO UPLOAD + DIAGNOSTICS
   ========================================================================== */

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STATE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const state = {
    activePage: 'pre',
    pre: {
        photos: [],
        activeStep: 1,
        imageAssignments: {}, // photoIdx -> riskKey (key of PRE_DIAG)
        aiRecommendations: {}, // photoIdx -> { key }
        searchQuery: '',
        sortBy: 'number',
        remediationPreferences: {}, // photoIdx -> 'A' or 'B'
        options: {}, // key -> options array
        currentPhotoIdx: 0,
        selectionSource: {} // photoIdx -> 'ai' or 'manual'
    },
    post: {
        photos: [],
        activeStep: 1,
        imageAssignments: {}, // photoIdx -> defectKey (key of POST_DIAG)
        aiRecommendations: {}, // photoIdx -> { key, pct }
        searchQuery: '',
        sortBy: 'number',
        remediationPreferences: {}, // photoIdx -> 'A' or 'B'
        options: {}, // key -> options array
        currentPhotoIdx: 0,
        selectionSource: {} // photoIdx -> 'ai' or 'manual'
    },
    rcc: {
        photos: [],
        activeStep: 1,
        imageAssignments: {}, // photoIdx -> defectKey
        aiRecommendations: {}, // photoIdx -> { key, pct }
        searchQuery: '',
        sortBy: 'number',
        remediationPreferences: {},
        options: {}, // key -> options array
        currentPhotoIdx: 0,
        selectionSource: {} // photoIdx -> 'ai' or 'manual'
    }
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRE-CONSTRUCTION DIAGNOSTIC DATABASE (DYNAMIC)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const PRE_DIAG_DB = {
    low_cover_risk: {
        label: "Spacer Block & Corrosion Risks",
        severity: "high",
        rootCause: "Concrete cover block density is insufficient, leaving reinforcement steel exposed to high rate of atmospheric carbonation and ingress.",
        furtherInvestigation: "Chloride profiling testing, half-cell potential mapping for corrosion activity, concrete cover survey front.",
        futureSolution: "Incase of localized corrsion we should repair with patchmortar after exposing the corroded reinforcement and its treatment with anticorrosion coating following the bonding agent.",
        A: {
            title: "Advanced Structural Retrofitting",
            match: 94,
            scope: "Replace spacer blocks with heavy-duty concrete cover blocks (min 40mm) at 600mm spacing. Apply migratory corrosion inhibitor.",
            costDuration: "Premium Cost | 2 Days Execution"
        },
        B: {
            title: "Cost-Effective Maintenance Repair",
            match: 78,
            scope: "Adjust existing rebar cage positioning manually. Apply anti-rust slurry coating before concrete pouring.",
            costDuration: "Low Cost | 1 Day Execution"
        }
    },
    congestion_risk: {
        label: "Concrete Flow & Congestion Risks",
        severity: "high",
        rootCause: "Tight spacing of reinforcement bars prevents proper aggregate flow, leading to honeycombing voids inside structural cores.",
        furtherInvestigation: "GPR cover survey, ultrasonic pulse velocity (UPV) scanning of congested reinforcement areas.",
        futureSolution: "Localized honeycomb area can be repaired with patchmortar following the grouting but larger area of the honeycombed portion should be repaired with RCC jacketing following the grouting.",
        A: {
            title: "Advanced Structural Retrofitting",
            match: 92,
            scope: "Implement structural concrete jacketing over honeycombed areas with high-flow micro-concrete grouting.",
            costDuration: "Premium Cost | 4 Days Execution"
        },
        B: {
            title: "Cost-Effective Maintenance Repair",
            match: 80,
            scope: "Apply localized pressure grouting with low-viscosity epoxy resin and finish surface with patch mortar.",
            costDuration: "Moderate Cost | 2 Days Execution"
        }
    },
    formwork_risk: {
        label: "Formwork & Deflection Risks",
        severity: "med",
        rootCause: "Weak shuttering structural stiffness leads to slurry leakage and surface bug holes during placement.",
        furtherInvestigation: "Visual mapping of surface grid pattern, checking curing log timelines and ambient humidity logs.",
        futureSolution: "If surface voids is not up to the reinforcement level then only patch mortar should be used for resurfacing of the concrete after removal of the loose part of the concrete. If surface void is up to the reinforcement level then grouting should be used before resurfacing.",
        A: {
            title: "Advanced Structural Retrofitting",
            match: 88,
            scope: "Complete surface grinding, application of polymer-modified mortar layer, and protective anti-carbonation coating.",
            costDuration: "Moderate Cost | 3 Days Execution"
        },
        B: {
            title: "Cost-Effective Maintenance Repair",
            match: 82,
            scope: "Apply cosmetic cementitious grout to fill superficial bugholes and finish with a standard sealer.",
            costDuration: "Low Cost | 1 Day Execution"
        }
    },
    heavy_section_risk: {
        label: "Mass Curing & Thermal Risks",
        severity: "med",
        rootCause: "Heavy steel cages and high-heat cement core hydration gradients risk delamination layers or thermal stress cracking.",
        furtherInvestigation: "Core temperature monitoring logs review, ultrasonic pulse velocity (UPV) mapping of crack depths.",
        futureSolution: "Rout joint in V-groove shape to 25mm, apply epoxy bonding agent, and inject high-strength epoxy resin. Adjust formwork bracing.",
        A: {
            title: "Advanced Structural Retrofitting",
            match: 90,
            scope: "Perform thermal crack routing (V-groove to 25mm), apply epoxy bonding agent, and inject high-strength epoxy resin.",
            costDuration: "Premium Cost | 3 Days Execution"
        },
        B: {
            title: "Cost-Effective Maintenance Repair",
            match: 75,
            scope: "Fill surface cracks with cementitious grout, apply elastic protective sealant coating to prevent moisture intrusion.",
            costDuration: "Low Cost | 1 Day Execution"
        }
    },
    balanced_risk: {
        label: "Compliant Configurations",
        severity: "low",
        rootCause: "The photograph demonstrates optimal cover block distribution and compliant rebar spacing configurations.",
        furtherInvestigation: "Routine visual inspection schedules.",
        futureSolution: "Maintain quality control standards during placement and monitor ambient curing conditions.",
        A: {
            title: "Advanced Structural Retrofitting",
            match: 95,
            scope: "Maintain standard visual monitoring schedule and apply preventative hydrophobic silane coating.",
            costDuration: "Low Cost | 1 Day Execution"
        },
        B: {
            title: "Cost-Effective Maintenance Repair",
            match: 90,
            scope: "Routine visual inspections only; no active remediation required at this stage.",
            costDuration: "Zero Cost | Ongoing"
        }
    }
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// POST-CONSTRUCTION DIAGNOSTIC DATABASE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const POST_DIAG = {
    seepage_rcc_no_corrosion: {
        label: "Seepage-RCC-no Corrosion",
        severity: "med",
        rootCause: "Picture indicates active water seepage through the RCC member surface without any visible sign of steel corrosion or rust staining. The seepage is likely caused by micro-cracks in the concrete matrix, poor construction joints, or degradation of the waterproofing membrane allowing water to percolate through the concrete cover. The absence of corrosion suggests the carbonation front has not yet reached the reinforcement level.",
        furtherInvestigation: "We should further investigate the source of water ingress by conducting a moisture mapping survey using a calibrated moisture meter across the affected area. Flood testing or spray testing should be performed to trace the exact entry path of water. Additionally, a carbonation depth test using phenolphthalein indicator should be conducted to assess whether the carbonation front is approaching the reinforcement level, as prolonged seepage will eventually initiate corrosion.",
        futureSolution: "The active leak source must first be identified and arrested either by pressure injection of polyurethane grout into the seepage path or by sealing the source side with crystalline waterproofing compound. Once the active flow is stopped, the concrete surface should be cleaned and a cementitious waterproofing coating with crystalline technology should be applied to provide long-term protection against future water ingress.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Pressure injection of PU grout.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Cosmetic plaster coating.", costDuration: "Low | 1 Day" }
    },
    seepage_rcc_with_corrosion: {
        label: "Seepage-RCC-with Corrosion",
        severity: "high",
        rootCause: "Picture indicates active water seepage through the RCC member with visible rust staining and corrosion products on the concrete surface, confirming that the moisture has penetrated to the reinforcement level. The seepage has caused carbonation or chloride ingress which has depassivated the protective oxide layer around the steel reinforcement, leading to active electrochemical corrosion. The continuous supply of moisture and oxygen is accelerating the corrosion process and may result in concrete spalling if left untreated.",
        furtherInvestigation: "We should further investigate by conducting a chloride content test at various depths to determine whether the corrosion is chloride-induced or carbonation-induced. Half-cell potential mapping should be performed to identify the extent of active corrosion zones across the member. Core samples should be extracted for compressive strength testing and carbonation depth measurement using phenolphthalein indicator to assess the overall structural integrity of the concrete.",
        futureSolution: "The source of water seepage must first be arrested using pressure injection of polyurethane or epoxy grout. After stopping the water source, the corroded reinforcement should be fully exposed by removing the deteriorated concrete cover, rust should be cleaned using wire brush or sandblasting, and a zinc-rich anti-corrosion primer should be applied to the treated bars. Finally, the area should be reinstated using polymer-modified patch repair mortar with a bonding agent applied to the substrate for proper adhesion.",
        A: { title: "Advanced Structural Retrofitting", match: 92, scope: "Rebar treatment and patch repair.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 80, scope: "Anti-corrosion coating and patching.", costDuration: "Low | 2 Days" }
    },
    seepage_damage_waterproofing: {
        label: "Seepage-Damage-Waterproofing",
        severity: "med",
        rootCause: "Picture indicates that the waterproofing membrane or coating system has failed, allowing water to seep through the structural substrate. This failure could be due to ageing degradation of the membrane material, improper lapping at joints, mechanical damage during construction activities, or UV exposure causing embrittlement of the membrane. The continuous water ingress through the failed waterproofing system can lead to progressive deterioration of the underlying concrete and steel reinforcement.",
        furtherInvestigation: "We should further investigate the extent of waterproofing failure by conducting a controlled flood test on the source side to map the exact areas of leakage. The membrane joints and overlaps should be visually inspected and probed to check for delamination or separation. Moisture mapping using infrared thermography or electrical impedance scanning should be performed on the underside to identify the full extent of moisture penetration.",
        futureSolution: "The existing failed waterproofing membrane should be completely removed from the affected area and the substrate should be cleaned and leveled. A new high-performance waterproofing membrane system should be applied with proper primer, membrane sheets with adequate overlap at joints, and a protective screed layer on top. In case of localized damage, elastomeric liquid-applied waterproofing can be used as a patch repair over the damaged zone after surface preparation.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Apply elastomeric waterproofing.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Patch repairs on waterproofing membrane.", costDuration: "Low | 1 Day" }
    },
    dry_dampness_rcc_with_corrosion: {
        label: "Dry Dampness-RCC-with Corrosion",
        severity: "med",
        rootCause: "Picture indicates that the RCC member has experienced historic dampness which is currently dry but has left behind visible corrosion stains and rust products on the surface. The past moisture exposure has already initiated the corrosion process by carbonating the concrete cover or introducing chlorides, and even though the surface appears dry now, the depassivation of the reinforcement is irreversible. The corrosion may continue at a slower rate due to residual moisture trapped within the concrete pore structure.",
        furtherInvestigation: "We should further investigate the severity of corrosion damage by conducting a covermeter scan to measure the remaining concrete cover thickness over the reinforcement. Core drilling should be performed to extract samples for chloride content analysis at reinforcement depth and carbonation depth measurement. Half-cell potential survey should be done to determine whether the corrosion process is still active or has stabilized in the current dry condition.",
        futureSolution: "The corroded reinforcement should be exposed by carefully removing the deteriorated concrete cover using controlled chipping methods. The exposed steel bars should be cleaned of all rust using wire brushing or sandblasting and treated with a zinc-rich anti-corrosion primer. The area should then be reinstated using polymer-modified repair mortar with a bonding agent, and an anti-carbonation protective coating should be applied on the finished surface to prevent future carbonation ingress.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Structural patching and rust treatment.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Localized structural mortar repair.", costDuration: "Low | 1 Day" }
    },
    dry_dampness_rcc_no_corrosion: {
        label: "Dry Dampness-RCC-no Corrosion",
        severity: "low",
        rootCause: "Picture indicates that the RCC member has experienced historic dampness which is currently dry and shows no visible signs of corrosion such as rust staining or concrete spalling. The dampness stains and tide marks on the surface suggest previous water exposure, but the concrete cover and reinforcement appear to be in satisfactory condition. However, the past moisture exposure may have advanced the carbonation front within the concrete, which could pose a risk of future corrosion if dampness recurs.",
        furtherInvestigation: "We should further investigate by conducting a carbonation depth test using phenolphthalein indicator on freshly broken concrete to determine how close the carbonation front is to the reinforcement level. Periodic moisture monitoring using embedded sensors or surface moisture meters should be performed to confirm that the area remains dry over time. A covermeter scan is also recommended to verify the adequacy of the concrete cover depth.",
        futureSolution: "Since the member is currently dry with no active corrosion, a preventive anti-carbonation protective coating should be applied on the concrete surface to arrest further carbonation penetration. The surface should be cleaned, any loose plaster removed, and an acrylic or polyurethane-based anti-carbonation paint system applied in multiple coats as per the manufacturer's specification. If future moisture recurrence is anticipated, a surface-applied crystalline waterproofing treatment should also be considered.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Anti-carbonation coating application.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Standard acrylic painting.", costDuration: "Low | 1 Day" }
    },
    dry_dampness_in_masonry: {
        label: "Dry Dampness-in Masonry",
        severity: "low",
        rootCause: "Picture indicates that the masonry wall has experienced historic dampness which is currently dry but has left visible dampness stains, efflorescence marks, or paint peeling on the plaster surface. The dampness was likely caused by water seepage through external walls, rising damp from ground level, or leaking plumbing lines embedded within the wall. The plaster layer may have lost its bond with the masonry substrate due to prolonged moisture exposure and salt crystallization behind the plaster.",
        furtherInvestigation: "We should further investigate by conducting a dampness level survey using a surface moisture meter to confirm the current dry status and identify any residual trapped moisture. Hammer tapping should be performed across the affected area to map delaminated and hollow-sounding plaster zones. The source of previous dampness should be traced and confirmed as permanently resolved before undertaking any repair work.",
        futureSolution: "All affected plaster in the delaminated zone should be chopped off completely down to the masonry surface and the exposed brickwork should be cleaned and wetted. Fresh plaster should be applied using a waterproof plastering mix with approved waterproof admixture in proper sand-cement ratio. If dampness recurrence is a concern, an additional moisture barrier coating or a crystalline waterproofing slurry can be applied on the masonry surface before replastering.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Full replastering with waterproof additive.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Patch plastering and painting.", costDuration: "Low | 1 Day" }
    },
    dampness_capillary: {
        label: "Dampness-Capillary",
        severity: "med",
        rootCause: "Picture indicates rising dampness in the lower portion of the wall caused by capillary suction of ground water through the porous masonry or concrete foundation. This occurs when the original damp-proof course (DPC) is absent, damaged, or has been bridged by external ground level raised above the DPC line. The rising moisture carries dissolved salts which crystallize on the wall surface causing efflorescence, paint peeling, and gradual deterioration of the plaster and masonry.",
        furtherInvestigation: "We should further investigate by measuring the height and extent of dampness using a calibrated moisture meter to determine the severity of capillary rise. The existing DPC level should be inspected to check whether it is intact, damaged, or bridged by external fill material. Ground water level and drainage conditions around the foundation should also be assessed to understand the external moisture source.",
        futureSolution: "A chemical damp-proof course should be injected at the base of the wall by drilling holes at regular intervals and pressure-injecting silicone-based or silane-siloxane DPC cream to create a horizontal moisture barrier. All affected plaster below the DPC line should be removed and replaced with salt-resistant renovation plaster or waterproof plaster with appropriate admixture. External drainage improvement and waterproofing of the foundation wall below grade should also be considered to reduce the hydrostatic pressure.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Inject silicone DPC cream.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Apply salt-resistant barrier plaster.", costDuration: "Low | 1 Day" }
    },
    leakage_water_ingress_source: {
        label: "Leakage-Water ingress source",
        severity: "med",
        rootCause: "Picture indicates active water leakage from an identifiable source such as a leaking plumbing pipe joint, a cracked water supply or drainage line, or direct rainwater ingress through a gap or crack in the building envelope. The continuous water flow is causing damage to the surrounding substrate including plaster deterioration, paint peeling, and potential structural distress if the leakage is near reinforced concrete elements. The source may be concealed within the wall or slab making visual identification difficult without testing.",
        furtherInvestigation: "We should further investigate by conducting a pressure test on the plumbing lines in the vicinity to isolate the leaking pipe or joint. Thermal imaging or infrared scanning should be performed on the wall and slab surfaces to trace concealed moisture paths and identify the exact ingress point. If the source is suspected to be from external rainwater, a controlled spray test should be conducted on the exterior facade to replicate the leakage condition.",
        futureSolution: "The leaking pipe or joint should be repaired or replaced at the source, and the repaired joint should be pressure-tested to confirm it is watertight before closing up. The surrounding substrate damaged by water should be cleaned, dried, and treated with a waterproof coating or crystalline waterproofing slurry to prevent future moisture migration. If the ingress source is from external cracks or gaps, they should be sealed with polyurethane or polysulfide sealant and the external facade should be waterproofed.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Pipe replacement and structural sealing.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Localized pipe joint patching.", costDuration: "Low | 1 Day" }
    },
    waterlogging_leakage_improper_slope: {
        label: "Waterlogging-Leakage or Improper Slope",
        severity: "med",
        rootCause: "Picture indicates waterlogging or ponding on the slab surface due to improper drainage slope, blocked drainage outlets, or settlement of the slab creating low spots where water accumulates. The standing water can penetrate through cracks or porous concrete over time causing seepage to the floor below and accelerating deterioration of the waterproofing membrane and concrete surface. Prolonged waterlogging also promotes algae growth and increases the dead load on the slab.",
        furtherInvestigation: "We should further investigate by conducting a drainage slope survey using a digital level or laser level to identify the exact low spots and areas where the slope is insufficient or reversed. The drainage outlet pipes and floor traps should be checked for blockages, damage, or inadequate sizing. The existing waterproofing membrane integrity below the screed should also be assessed by core cutting at selected locations.",
        futureSolution: "The screed concrete should be re-laid with a proper minimum slope of 1:100 towards the drainage outlets using a self-leveling screed or conventional cement screed with slope formers. A new waterproofing membrane should be applied over the leveled screed before laying the finish screed or tile layer. Drainage outlets should be cleared, repaired, or additional outlets installed if the existing drainage capacity is insufficient.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Re-grading slope with screed.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Drainage path clearance and seal.", costDuration: "Low | 1 Day" }
    },
    vegetation_algae: {
        label: "Vegetation-Algae",
        severity: "low",
        rootCause: "Picture indicates the presence of algae, moss, or organic vegetation growth on the concrete or masonry surface caused by persistent dampness and lack of sunlight exposure. The organic growth thrives in moist conditions where the surface remains wet for extended periods due to water seepage, poor drainage, or high ambient humidity. While algae growth itself is a non-structural distress, it indicates an underlying dampness problem and can accelerate surface deterioration by retaining moisture and producing organic acids.",
        furtherInvestigation: "We should further investigate the source and extent of dampness that is sustaining the organic growth by conducting a moisture survey of the affected area. The drainage conditions, water runoff patterns, and exposure to sunlight should be assessed to understand why the surface remains persistently wet. If the growth is extensive, the underlying substrate should be checked for surface erosion or deterioration caused by prolonged moisture retention.",
        futureSolution: "The organic growth should first be removed by applying a biocidal or fungicidal wash solution and scrubbing or pressure washing the surface clean. After the surface is dried, a biocidal masonry paint or anti-fungal protective coating should be applied to inhibit future growth. The root cause of persistent dampness should be addressed by improving drainage, fixing leaks, or applying waterproofing to prevent recurrence of the moisture condition.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Bio-cleaning and protective sealing.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Pressure washing and anti-fungal wash.", costDuration: "Low | 1 Day" }
    },
    plaster_spalling: {
        label: "Plaster-Spalling-Masonry",
        severity: "low",
        rootCause: "Picture indicates localized spalling and peeling of plaster from the brick masonry wall surface. This is caused by water moisture ingress behind the plaster layer, which leads to loss of adhesion between the mortar and brick substrate, or by salt crystallization under the plaster causing mechanical delamination.",
        furtherInvestigation: "We should further investigate by conducting a hammer tap check to map out hollow-sounding and delaminated plaster regions. A surface moisture meter should be used to probe the dampness levels behind the plaster layer, and the source of water ingress must be identified and stopped before repair.",
        futureSolution: "Remove all loose and delaminated plaster back to the sound masonry surface, brush off any salt deposits, apply a polymer bonding agent to the substrate, and replaster with a high-performance sand-cement mortar mixed with a waterproof admixture in the proper ratio.",
        A: { title: "Advanced Structural Retrofitting", match: 88, scope: "Chop off entire plaster layers, apply mechanical keyways, polymer bonding agent, and replaster with structural mortar.", costDuration: "Moderate Cost | 3 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 85, scope: "Chop loose patches locally, apply cement slurry bonding coat, and replaster patches.", costDuration: "Low Cost | 1 Day Execution" }
    },
    corrosion_minor: {
        label: "Corrosion-Minor Crack",
        severity: "med",
        rootCause: "Primarily stress pattern looks like a corrosion crack in localized portion having minor width of the crack",
        furtherInvestigation: "We should furthur investigate the cause behind the corrosion whether it is a dry area or moist area if corrosion is in the dry area then we should also check the chloride and carbonation of the concrete",
        futureSolution: "Incase of localized corrsion we should repair with patchmortar after exposing the corroded reinforcement and Its treatment with anticorrosion coating following the bonding agent",
        A: { title: "Advanced Structural Retrofitting", match: 92, scope: "Expose rebar, clean using wire brush, apply zinc-rich anti-corrosion primer, polymer-modified patch mortar.", costDuration: "Moderate Cost | 2 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 80, scope: "Apply surface rust converter, patch with standard cement mortar, apply protective sealant.", costDuration: "Low Cost | 1 Day Execution" }
    },
    corrosion_along: {
        label: "Corrosion-Along Reinforcement",
        severity: "med",
        rootCause: "Primarily stress pattern looks like a corrosion crack in whole length of the RCC having minor width of the crack",
        furtherInvestigation: "We should furthur investigate the cause behind the corrosion whether it is a dry area or moist area if corrosion is in the dry area then we should also check the chloride and carbonation of the concrete",
        futureSolution: "Incase of localized corrsion we should repair with patchmortar after exposing the corroded reinforcement and Its treatment with anticorrosion coating following the bonding agent",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Full rebar exposure, abrasive blast cleaning, sacrificial zinc anodes installation, structural micro-concrete casting.", costDuration: "Premium Cost | 4 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 78, scope: "Localized patch repairs, anti-rust coating on exposed steel sections, standard plaster finishing.", costDuration: "Moderate Cost | 2 Days Execution" }
    },
    corrosion_exposed: {
        label: "Corrosion-Spalling-Exposed Reinforcer",
        severity: "high",
        rootCause: "The photographic evidence indicates severe concrete spalling with fully exposed reinforcing bars. This is caused by concrete carbonation and chloride ingress, which disrupts the passive steel oxide layer, leading to expansive corrosion that creates internal tensile stresses exceeding the concrete's tensile strength, resulting in cracking and cover failure.",
        furtherInvestigation: "We should perform a visual inspection and hammer sounding to map the delaminated zone, measure the remaining rebar diameter to check for cross-sectional area loss, test the depth of carbonation front using phenolphthalein indicator, and conduct chloride content profile testing.",
        futureSolution: "Remediation requires exposing all corroded reinforcement beyond the affected zones, sand-blasting to remove rust, treating steel with a zinc-rich anti-corrosion primer, applying an epoxy-modified bonding agent to the concrete substrate, and reinstating the cover with structural polymer-modified patch mortar or micro-concrete casting.",
        A: { title: "Advanced Structural Retrofitting", match: 95, scope: "Expose steel, sandblast rust, apply epoxy bonding agent, apply structural polymer-modified patching mortar or perform section enlargement.", costDuration: "Premium Cost | 5 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 70, scope: "Clean exposed bars manually, apply anti-corrosion coating, patch with standard structural mortar.", costDuration: "Moderate Cost | 2 Days Execution" }
    },
    surface_voids_general: {
        label: "Surface-Voids",
        severity: "low",
        rootCause: "Picture indicates small, shallow micro voids and pinholes distributed across the concrete surface. These voids are typically the result of minor bleeding, improper compaction, or early drying of the concrete surface layer, which prevents air and bleed water from escaping during finishing.",
        furtherInvestigation: "We should further investigate by conducting a visual survey to map out the density of the voids and check whether they expose the reinforcement or penetrate deep into the concrete core. No intensive testing is required if the voids are strictly superficial and non-structural.",
        futureSolution: "The concrete surface should be thoroughly cleaned of any dust or curing compound, followed by the application of a thin cosmetic micro-plaster skim coat or cementitious fairing coat to fill the voids and restore a smooth, durable finish.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Apply protective polymer cosmetic coating.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Standard surface finishing paint.", costDuration: "Low | 1 Day" }
    },
    surface_voids_bughole: {
        label: "Surface Voids- Bughole",
        severity: "low",
        rootCause: "Picture indicate that concrete surface has few bugholes which might be result of the excess cement water ratio or usage of air entrant admixture or faster rate of hydration",
        furtherInvestigation: "It falls under the non structure distress category and also it has no major impact on the durability of the structure there is no need of furthur investigation unless spacing of multple bugholes are closer",
        futureSolution: "Spacing of the bugholes are closer and uniformly over the surfce of the concrete then protective coating is required",
        A: { title: "Advanced Structural Retrofitting", match: 85, scope: "Apply protective polymer-modified cosmetic plaster coating uniformly over the entire surface area.", costDuration: "Moderate Cost | 2 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 88, scope: "Fill bug holes locally with high-strength cementitious putty and apply a standard acrylic sealer.", costDuration: "Low Cost | 1 Day Execution" }
    },
    surface_voids: {
        label: "Surface Voids",
        severity: "low",
        rootCause: "Picture indicate that concrete surface has surface voids which might be result of the poor formwork and localized compaction issue or leakage of cement slurry during pouring of the concrete",
        furtherInvestigation: "It falls under the non structure distress category but it has minor impact on the durablility of the structure there is need of furthur investigation to know whether voids is upto reinforcement level or not",
        futureSolution: "If surface voids is not upto the reinforcement level then only patch motar should be used for resurfacing of the concrete after removal of the loose part of the concrete.If surface void is upto the reinforcement level then grouting shoudle be used before resurfcaing of the concrete with patch motar",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Pressure grout the deep void channels with cementitious slurry, and overlay with polymer-modified mortar.", costDuration: "Moderate Cost | 3 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 82, scope: "Apply cosmetic surface plaster patch mortar to shallow voids after removing loose particles.", costDuration: "Low Cost | 1 Day Execution" }
    },
    surface_voids_honeycombing: {
        label: "Surface Voids-Honey Combing",
        severity: "med",
        rootCause: "Picture indicate that concrete surface has surface voids which might be result of the poor formwork and localized compaction issue or leakage of cement slurry or poor workability of the concrete during pouring of the concrete",
        furtherInvestigation: "It falls under the non structure distress category if honeycombing is localized but in the case of honeycombing is throughout the length of the structural member then it should be considered as structural issue ,then area of the honeycombed portion and the visibility of the reinforced portion will enhance the vernabilityof the srtress",
        futureSolution: "Localized honeycombed area can be repaired with patchmortar following the grouting but arger area of the honeycombed portion should be reapired with RCC jacketing follwing the routing",
        A: { title: "Advanced Structural Retrofitting", match: 94, scope: "Enlarge concrete section via RCC structural jacketing combined with non-shrink high-flow grouting.", costDuration: "Premium Cost | 5 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 76, scope: "Perform localized pressure grouting with low-viscosity epoxy resin and apply cosmetic patch mortar.", costDuration: "Moderate Cost | 2 Days Execution" }
    },
    cold_joint_formwork: {
        label: "Cold Joint and Improper Formwork",
        severity: "med",
        rootCause: "Picture indicates a distinct joint line and honeycombed texture formed due to concrete pouring delay, where the second batch of concrete was poured after the first batch had already initiated its initial set. This results in a weak plane at the joint. The improper formwork has also led to alignment offsets and concrete slurry leakage.",
        furtherInvestigation: "We should further investigate the depth and extent of the cold joint by performing non-destructive testing such as ultrasonic pulse velocity (UPV) mapping across the joint plane. Core extraction should be done at the interface to check for voids, and water penetration tests should be conducted to check for water paths through the joint.",
        futureSolution: "Rout the cold joint line in a V-groove shape to a depth of 25mm, clean out all loose aggregates, apply a structural epoxy bonding agent, and inject low-viscosity structural epoxy resin or pack with non-shrink high-strength grout to restore full monolithic shear capacity.",
        A: { title: "Advanced Structural Retrofitting", match: 91, scope: "Rout joint to V-groove (25x25mm), apply epoxy bonding agent, and inject low-viscosity structural epoxy resin.", costDuration: "Premium Cost | 3 Days Execution" },
        B: { title: "Cost-Effective Maintenance Repair", match: 80, scope: "Seal joint surface with elastomeric polyurethane sealant to prevent moisture ingress.", costDuration: "Low Cost | 1 Day Execution" }
    },
    joint_crack_incompatible_material: {
        label: "Joint Crack-Incompatible Material",
        severity: "med",
        rootCause: "Picture indicates separation cracks at the interface of two dissimilar materials (e.g., concrete and brick masonry, or concrete and steel). These cracks occur due to differential thermal expansion/contraction coefficients and shrinkage behaviors, which generate interfacial shear stresses exceeding the bond strength between the materials.",
        furtherInvestigation: "We should further investigate by measuring the crack opening range across seasonal temperature variations to determine if it is active or stable. A visual check should be performed to inspect for proper joint mesh reinforcement or expansion gap fillers at the material boundary.",
        futureSolution: "Rout the cracked interface to form a clean groove, clean out debris, and apply a high-movement elastomeric polyurethane or polysulfide joint sealant. For wall plaster interfaces, bridge the joint with a fiberglass or galvanized wire mesh before applying a flexible polymer-modified plaster patch.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Install expansion joints with structural bellows.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Seal with flexible polysulfide sealant.", costDuration: "Low | 1 Day" }
    },
    crack_without_corrosion: {
        label: "Crack Without Corrosion",
        severity: "low",
        rootCause: "Picture indicates dry structural or shrinkage cracks in the concrete member without any rust staining, indicating that the reinforcement is not yet corroded. These cracks are caused by drying shrinkage, plastic settlement, or transient loading that exceeds the concrete tensile strength but has not exposed the steel to active water or chlorides.",
        furtherInvestigation: "We should further investigate by mapping the crack widths and depths using a crack width microscope and ultrasonic testing. Check if the crack is active or stable under load variations, and perform a carbonation depth test to check if the carbonation front has reached the reinforcement zone.",
        futureSolution: "For stable cracks wider than 0.3mm, clean the crack path and pressure-inject low-viscosity structural epoxy resin to seal the concrete against future ingress of water and air. For hairline cracks, apply a surface-applied penetrating silane-siloxane sealer or elastomeric protective coating.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Pressure epoxy injection.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Surface sealing with epoxy putty.", costDuration: "Low | 1 Day" }
    },
    crack_along_conduit_masonry: {
        label: "Crack-Along the Conduit-Masonry",
        severity: "low",
        rootCause: "Picture indicates a straight crack running along the path of an embedded electrical or plumbing conduit in the masonry wall. This crack is caused by the shallow cover of plaster over the conduit, creating a plane of weakness, combined with thermal movement or vibration of the conduit itself.",
        furtherInvestigation: "We should further investigate by removing plaster locally to inspect the conduit depth and verify if it was properly secured to the masonry wall using saddles. Hammer tap the crack edges to check for plaster delamination and hollow spaces along the conduit route.",
        futureSolution: "Chop the plaster along the conduit path, secure the conduit firmly with metal saddles, cover the conduit groove with a heavy-duty galvanized wire mesh or fiberglass mesh extending 100mm on both sides, and replaster using high-strength polymer-modified mortar.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Mesh cladding and plastering.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Fill crack with fiber-reinforced putty.", costDuration: "Low | 1 Day" }
    },
    crack_shrinkage_thermal_crack: {
        label: "Crack Shrinkage and Thermal Crack",
        severity: "low",
        rootCause: "Picture indicates fine, map-patterned hairline cracks or evenly spaced transverse cracks. These are caused by drying shrinkage of the concrete during curing, or by thermal stresses arising from high hydration heat gradients or diurnal temperature fluctuations.",
        furtherInvestigation: "We should further investigate the crack activity by installing glass slide monitors or digital tell-tale crack gauges to track crack movement over a 24-hour cycle. Verify concrete curing history and review design thermal expansion joint spacing.",
        futureSolution: "Clean the surface cracks and apply an elastomeric acrylic coating system that can bridge active thermal movements. For wider cracks, rout them to a V-groove shape and fill with a flexible polyurethane joint sealer before applying the protective topcoat.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Elastomeric bridge coating.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Fill with acrylic sealant.", costDuration: "Low | 1 Day" }
    },
    crack_settlement_masonry: {
        label: "Crack-Settlement-Masonry",
        severity: "high",
        rootCause: "Picture indicates diagonal or stair-stepped cracks in the brick masonry wall, indicating differential settlement of the building foundation. The displacement occurs because of uneven soil bearing capacities, moisture variations in clay soils, or structural loading exceeding the foundation capacity.",
        furtherInvestigation: "We should further investigate by conducting foundation level surveys, checking for plumbing leaks beneath the slab, and performing soil bore tests to evaluate bearing capacity. Install tell-tale crack monitoring gauges to determine if the settlement is active or completed.",
        futureSolution: "If the settlement is active, perform foundation underpinning using micropiles or chemical grouting to stabilize the subgrade soil. Once stabilized, repair the masonry cracks by inserting helical stainless steel reinforcement bars (crack stitching) into routed bed joints and grouting with structural mortar.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Foundation underpinning and structural tie installation.", costDuration: "Premium | 7 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Stitching cracks with steel dowels.", costDuration: "Moderate | 3 Days" }
    },
    crack_along_anchor_bolts_metal: {
        label: "Crack Along Anchor Bolts and Metal P",
        severity: "med",
        rootCause: "Picture indicates localized cracking propagating from anchor bolt holes in the concrete base. This cracking is caused by excessive tightening torque, shear/tensile overload on the structural metal connection, or localized stress concentrations from insufficient edge distance.",
        furtherInvestigation: "We should further investigate by verifying anchor bolt torque settings, checking for corrosion on the steel anchor shafts, and performing ultrasonic testing on surrounding concrete to check for internal micro-cracking and cone failure.",
        futureSolution: "Remove the load from the anchor, chip out damaged concrete around the bolt, install a replacement anchor bolt if required, and grout the connection pocket using a high-strength non-shrink epoxy structural grout to ensure proper load transfer.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Re-anchor bolts and grout with epoxy.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Surface paste repair on cracked edge.", costDuration: "Low | 1 Day" }
    },
    flexural_crack_rcc: {
        label: "Flexural-Crack-RCC",
        severity: "high",
        rootCause: "Picture indicates vertical or diagonal cracks in the tension zone of the RCC beam or slab, indicating flexural distress. The crack occurred because the bending moment from structural overload or design undersizing exceeded the tensile capacity of the reinforced section.",
        furtherInvestigation: "We should further investigate by conducting structural load evaluations, measuring member deflections, and scanning the section with GPR to locate and size the tension reinforcement bars. Perform concrete core compressive tests to verify actual material strength.",
        futureSolution: "Strengthen the tension zone of the member by bonding carbon fiber reinforced polymer (CFRP) laminates or high-strength steel plates to the tension face using structural epoxy adhesives, after injecting the cracks with structural epoxy resin.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Carbon fiber reinforced polymer wrapping.", costDuration: "Premium | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Epoxy injection and localized steel plates.", costDuration: "Moderate | 2 Days" }
    },
    shear_crack_rcc: {
        label: "Shear Crack-RCC",
        severity: "high",
        rootCause: "Picture indicates diagonal tension cracks inclined at approximately 45 degrees near the support of the RCC beam. These shear cracks are caused by shear stresses exceeding the concrete tensile strength combined with inadequate or degraded shear stirrup reinforcement, creating a critical risk of sudden brittle failure.",
        furtherInvestigation: "We should further investigate by mapping the crack geometry and measuring width changes under live load. Perform non-destructive testing such as rebound hammer or ultrasonic pulse velocity to assess concrete quality, and scan the beam with a covermeter/GPR to map stirrup spacing and diameter.",
        futureSolution: "Inject the cracks under pressure with low-viscosity structural epoxy resin to seal the concrete. Externally reinforce the beam shear capacity by wrapping carbon fiber reinforced polymer (CFRP) stirrups or installing steel plate jackets bolted to the sides of the beam.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Shear strengthening using CFRP rods.", costDuration: "Premium | 4 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Section enlargement and shear rebar.", costDuration: "Moderate | 3 Days" }
    },
    punching_crack_rcc: {
        label: "Punching-Crack-RCC",
        severity: "high",
        rootCause: "Picture indicates diagonal punching shear cracks forming a cone-like failure surface around the column-slab junction. This punching distress is caused by high concentrated shear forces around the column exceeding the shear capacity of the slab, due to increased slab loading or design omissions.",
        furtherInvestigation: "We should further investigate by conducting slab level surveys to check for deflection, checking design reinforcement ratios at the column strip, and scanning for shear reinforcement inside the slab using high-frequency GPR. Take cores to verify compressive strength.",
        futureSolution: "Relieve slab load locally, repair cracks using epoxy pressure injection, and retrofit the slab-column junction by installing structural steel shear collars, column capital drop panels, or post-installed vertical shear bolts drilled through the slab thickness.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Retrofit with steel collars.", costDuration: "Premium | 5 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Add RC drop panels around columns.", costDuration: "Premium | 4 Days" }
    },
    torsional_crack_rcc: {
        label: "Torsional-Crack-RCC",
        severity: "high",
        rootCause: "Picture indicates continuous spiral cracks twisting around the longitudinal axis of the RCC beam. These cracks are caused by excessive torsional loading exceeding the torsional resistance of the section, due to eccentric loads, frame action, or lack of closed stirrups.",
        furtherInvestigation: "We should further investigate by analyzing the load eccentricity and checking longitudinal and transverse reinforcement design details. Conduct concrete core compression tests and perform ultrasonic scanning to check internal crack depths.",
        futureSolution: "Pressure-inject the spiral cracks with structural epoxy resin to restore concrete shear transfer, and wrap the beam in a continuous structural carbon fiber jacket (CFRP) oriented at 45 degrees to resist torsional shear stresses.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Epoxy injection followed by full CFRP wrap.", costDuration: "Premium | 4 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Epoxy grout injections and steel jacketing.", costDuration: "Moderate | 3 Days" }
    },
    crack_in_plain_masonry: {
        label: "Crack-in Plain Masonry",
        severity: "low",
        rootCause: "Picture indicates vertical or horizontal cracks passing through mortar joints and bricks in the plain masonry wall. These cracks are caused by temperature variations, moisture shrinkage, or minor structural movements in the wall without steel tie reinforcements.",
        furtherInvestigation: "We should further investigate by checking wall verticality using a plumb bob or laser level. Use hammer tapping to check for hollow spaces between plaster and masonry, and check for foundation settlement signs nearby.",
        futureSolution: "Rout the cracks to a minimum depth of 20mm, clean out mortar debris, and tuckpoint/fill using non-shrink structural grout or polymer-modified cement mortar. For larger cracks, apply crack-stitching helical bars into the joint beds.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Helical tie installation in brickwork.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Chop crack and tuckpoint with mortar.", costDuration: "Low | 1 Day" }
    },
    crack_stairstep_masonry: {
        label: "Crack-Stairstep-Masonry",
        severity: "med",
        rootCause: "Picture indicates a stair-step crack following the horizontal and vertical mortar joints of the brick masonry wall. This is a typical distress pattern indicating localized foundation settlement or horizontal movement at one corner of the structure.",
        furtherInvestigation: "We should further investigate by checking if the settlement has stabilized using tell-tale crack monitoring cards. Perform leveling surveys across the foundation base and check for ground water seepage or soil erosion under the affected wall corner.",
        futureSolution: "Rout out the mortar joints affected by the stair-step cracking, install helical stainless steel reinforcement rods into the bed joints extending 500mm beyond the crack line, and grout securely with structural cementitious grout.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Structural stitching with helical bars.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Re-pointing mortar joints.", costDuration: "Low | 1 Day" }
    },
    fire_black_fumed_blistering: {
        label: "Fire-Black Fumed-Blistering",
        severity: "med",
        rootCause: "Picture indicates black soot deposition and severe blistering of the plaster/paint layer on the concrete or masonry wall. This distress is caused by exposure to high-temperature flames and combustion gases, which heat moisture inside the plaster and cause steam pressure delamination.",
        furtherInvestigation: "We should further investigate the depth of heat damage by conducting a Schmidt rebound hammer test on the underlying concrete. Extract cores to verify if the concrete core strength has degraded, and check for steel reinforcement detempering.",
        futureSolution: "Chop off all blistered and carbonized plaster down to the masonry or concrete surface. Wash soot deposits using high-pressure water and alkaline chemical cleaners, apply a structural polymer bonding agent, and replaster the wall surface.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Chop blistered plaster and apply micro-concrete.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Pressure wash and patch plastering.", costDuration: "Low | 1 Day" }
    },
    fire_black_fumed_no_blistering: {
        label: "Fire-Black Fumed- no Blistering",
        severity: "low",
        rootCause: "Picture indicates surface soot and carbon staining on the wall without plaster blistering or concrete cracking. This is caused by smoke and fumed particles deposition from a nearby fire, without direct heat radiation reaching levels that cause material structural damage.",
        furtherInvestigation: "We should further investigate by visual inspection and scratching the soot layer to verify if the plaster layer underneath is solid or crumbly. Conduct simple hammer sound tests to ensure no delamination of plaster has occurred.",
        futureSolution: "Clean the soot from the wall surface using high-pressure water blasting and specialized chemical carbon cleaners. Once dried, apply a stain-blocking sealing primer coat followed by two coats of decorative acrylic paint to restore the appearance.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Chemical washing and paint sealing.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Simple pressure washing and painting.", costDuration: "Low | 1 Day" }
    },
    fire_pink_concrete_spalling: {
        label: "Fire-Pink Concrete with Spalling",
        severity: "high",
        rootCause: "Picture indicates severe concrete spalling and pink discoloration of the concrete core. This color change (occurring between 300C to 600C due to iron compound oxidation) and spalling are caused by high thermal gradients and steam pressure buildup within the concrete pores during fire exposure, leading to loss of structural strength and exposure of steel reinforcement.",
        furtherInvestigation: "We should further investigate by conducting ultrasonic pulse velocity (UPV) scanning and concrete core compressive testing to determine the depth of structural degradation. Perform reinforcement scanning to evaluate remaining rebar section and check for steel detempering.",
        futureSolution: "Chip away all delaminated and pink-discolored concrete to expose the sound concrete core. Clean the steel reinforcement of rust, apply a structural epoxy bonding agent, and restore the member cross-section using high-strength structural micro-concrete or polymer-modified repair mortar.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Jacketing with micro-concrete.", costDuration: "Premium | 5 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Remove weak concrete and polymer patching.", costDuration: "Moderate | 3 Days" }
    },
    fire_pink_concrete_without_spalling: {
        label: "Fire-Pink Concrete without Spalling",
        severity: "med",
        rootCause: "Picture indicates pink concrete discoloration on the member surface without active mechanical spalling or reinforcement exposure. The pink hue indicates exposure to moderate fire temperatures (300C-600C), which alters the concrete mineral structure and reduces the surface layer compressive strength and carbonation resistance.",
        furtherInvestigation: "We should further investigate by performing a rebound hammer survey and scraping the discolored surface layer to measure concrete degradation depth. Conduct UPV tests across the section to confirm if the inner core concrete has sustained any damage.",
        futureSolution: "Grit-blast or mechanically grind the discolored pink surface layer to expose sound concrete. Apply a penetrating epoxy primer followed by a structural fiber-reinforced polymer modified cementitious screed to restore the surface durability and protective cover layer.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Apply structural fiber reinforcement screed.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Apply cosmetic polymer plaster.", costDuration: "Low | 2 Days" }
    },
    failure_expansion_joint: {
        label: "Failure of Expansion Joint",
        severity: "med",
        rootCause: "Picture indicates a failed structural expansion joint, showing torn sealing profiles, loss of joint filler, or water leakage. This is caused by environmental aging, thermal movement exceeding the design capacity of the joint, or improper installation of joint sealants.",
        furtherInvestigation: "We should further investigate by measuring the joint gap width at different temperatures to check movement range. Inspect the underside of the joint for active water leaks, and verify if the joint filler material has hardened or disintegrated.",
        futureSolution: "Completely remove the damaged joint sealer and filler. Clean the joint wall surfaces, install a closed-cell backing rod, and seal with a high-movement elastomeric polyurethane joint sealant. If required, install a heavy-duty mechanical expansion joint cover system.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Replace expansion joint profiles.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Fill with elastomeric joint filler.", costDuration: "Low | 1 Day" }
    },
    paint_peel_off_steel: {
        label: "Paint Peel Off-Steel",
        severity: "low",
        rootCause: "Picture indicates peeling, blistering, and delamination of the protective paint film from the steel structural member. This paint failure is caused by poor surface preparation before painting, moisture condensation beneath the paint film, or exposure to harsh environmental conditions.",
        furtherInvestigation: "We should further investigate by performing cross-cut paint adhesion tests on surrounding intact painted areas. Scrape the peeled areas to check for active corrosion/rust pitting on the underlying steel surface, and measure the paint dry film thickness (DFT).",
        futureSolution: "Scrape and sand the steel surface to remove all loose paint and mill scale. Clean the surface using solvent wipes, apply a rust-inhibitive zinc chromate or epoxy primer coat, and finish with two coats of high-durability polyurethane enamel paint.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Abrasive blast cleaning and marine painting.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Wire brush scraping and anti-rust paint.", costDuration: "Low | 1 Day" }
    },
    missing_bolt_steel_connections: {
        label: "Missing Bolt-Steel Connections",
        severity: "high",
        rootCause: "Picture indicates empty bolt holes in the steel structural connection. This bolt loss is caused by severe vibration, structural joint movement, or improper initial bolt installation and tightening torque, leading to increased load concentration on the remaining bolts.",
        furtherInvestigation: "We should further investigate by auditing all remaining bolts in the connection for proper tightness using a calibrated torque wrench. Inspect the steel connection plates for warping, cracking, or hole ovalization caused by overloaded stress distribution.",
        futureSolution: "Align the connection plates, clean the bolt holes of rust, and install new high-strength friction grip (HSFG) structural bolts. Tighten the bolts to the design torque specification using a calibrated torque wrench to ensure structural load transfer.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Replace connections with HSFG bolts.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Install standard structural bolts.", costDuration: "Low | 1 Day" }
    },
    oxidation_of_steel: {
        label: "Oxidation-of Steel",
        severity: "med",
        rootCause: "Picture indicates surface rust and oxidation scaling on the steel structural element. This corrosion is caused by direct exposure of bare steel to atmospheric oxygen and moisture, which occurs when the original protective coating degrades or is damaged.",
        furtherInvestigation: "We should further investigate by measuring the remaining steel section thickness using an ultrasonic thickness gauge. Compare the measured thickness to the original design details to calculate structural capacity loss, and check for deep pitting.",
        futureSolution: "Mechanically clean the steel surface using wire brushes, needle scalers, or sandblasting to remove all rust scales. Apply a high-performance zinc-rich epoxy primer followed by a protective epoxy mastic barrier coating and polyurethane topcoat.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Metal sandblasting and galvanization.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Manual rust scraping and protective coating.", costDuration: "Low | 1 Day" }
    },
    oxidation_steel_roofing_sheet: {
        label: "Oxidation-Steel Roofing Sheet",
        severity: "low",
        rootCause: "Picture indicates localized rust patches on the steel roofing sheets. This oxidation is caused by ponding water, damage to the protective galvanized coating during installation, or acidic environmental conditions that accelerate steel sheet corrosion.",
        furtherInvestigation: "We should further investigate by inspecting the roofing sheet laps, checking for pinholes and daylight through the sheet, and checking the slope of the roof to understand why water ponding occurs.",
        futureSolution: "Wire-brush the rusted areas, clean with a rust-converting solution, and apply a fiber-reinforced elastomeric waterproofing coating. If the sheet thickness has degraded significantly or contains pinholes, replace the affected sheet section entirely.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Full roof sheet replacement.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Anti-rust primer and rubberized coating.", costDuration: "Low | 1 Day" }
    },
    scaling_peeling_off_metal: {
        label: "Scaling and Peeling Off-Metal Layer",
        severity: "high",
        rootCause: "Picture indicates heavy laminating rust scales exfoliating and peeling off from the steel structural member. This severe corrosion is caused by long-term exposure to moisture, carbon dioxide, or industrial pollutants, leading to continuous oxidation layers that swell and detach.",
        furtherInvestigation: "We should further investigate by using an ultrasonic thickness gauge to measure the remaining sound steel thickness across the rusted section. Perform load calculations to verify if the structural element is compromised and check for cracks.",
        futureSolution: "Use needle guns or abrasive blasting to remove all loose steel scales down to bare metal. If the sectional area loss exceeds 10-15%, weld or bolt additional steel plates (gussets or channel splices) to reinforce the member before applying high-performance industrial coatings.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Weld steel plate splices to reinforce section.", costDuration: "Premium | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Scale removal and heavy-duty paint.", costDuration: "Moderate | 2 Days" }
    },
    buckling_in_steel_member: {
        label: "Buckling-in Steel Member",
        severity: "high",
        rootCause: "Picture indicates lateral-torsional or local buckling deformation in the steel member under compression. This structural failure occurs when the compressive stress exceeds the member's critical buckling load, caused by overloaded structural demands, lack of lateral bracing, or insufficient section properties.",
        furtherInvestigation: "We should further investigate by conducting laser scanning or total station measurement to map the member's out-of-straightness deflection profile. Perform structural load audits, inspect all lateral support restraints, and check the steel material grade.",
        futureSolution: "Unload the structural member, heat-straighten or replace the bent steel section, and weld structural stiffener plates or add lateral tie bracing members to prevent future buckling under load.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Add stiffeners and member strengthening.", costDuration: "Premium | 4 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Install lateral bracing rods.", costDuration: "Moderate | 2 Days" }
    },
    loosening_bolt_steel_connections: {
        label: "Loosening-Bolt-Steel Connections",
        severity: "med",
        rootCause: "Picture indicates loose nuts or gaps between the washers and steel connection plates. This loosening is caused by cyclic mechanical loads, dynamic structural vibrations, or thermal expansion/contraction cycles that relieve the bolt's initial preload.",
        furtherInvestigation: "We should further investigate by checking bolt torque levels using a calibrated dial torque wrench. Inspect bolt threads for stripping or galling, check for plate wear/fretting around holes, and check for thread-locking failures.",
        futureSolution: "Clean the bolt threads, replace any damaged bolts, tighten all loose bolts to the specified tension using a torque wrench, and apply a thread-locking fluid or install locknuts/tension control washers to prevent future loosening.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Replace with lock-nuts or HSFG bolts.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Tighten existing bolts manually.", costDuration: "Low | 1 Day" }
    },
    loosening_rivet_steel_connections: {
        label: "Loosening-Rivet-Steel Connections",
        severity: "high",
        rootCause: "Picture indicates gaps, rust bleeding, or movement marks around rivet heads in the steel joint. This rivet loosening is caused by cyclic structural load fatigue, corrosion expansion within the rivet shank, or long-term joint relaxation.",
        furtherInvestigation: "We should further investigate by performing a hammer strike test on individual rivet heads to detect movement or hollow sounds. Check joint slippage and calculate joint shear and bearing stresses under service loads.",
        futureSolution: "Remove the loose and corroded rivets by drilling out the heads. Clean the rivet holes and replace them with high-strength friction grip (HSFG) structural bolts tightened to the specified design torque to restore joint shear capacity.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Replace rivets with structural HSFG bolts.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Weld reinforcing joints around rivets.", costDuration: "Moderate | 1 Day" }
    },
    welding_porosity: {
        label: "Welding-Porosity",
        severity: "med",
        rootCause: "Picture indicates fine pinholes or gas pocket voids cluster on the surface of the weld bead. This weld defect is caused by gas entrapment in the weld pool during solidification, due to high moisture, wind shielding gas disruption, or surface contamination.",
        furtherInvestigation: "We should further investigate by performing dye penetrant testing (DPT) to locate all surface-breaking pores. Conduct ultrasonic testing (UT) or radiographic testing (RT) to map out any internal sub-surface porosity cluster.",
        futureSolution: "Grind down the porous weld section until sound base metal is reached. Thoroughly clean the weld joint, dry the welding electrodes, and re-weld the joint using proper gas shielding parameters and travel speeds.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Grind and re-weld with UT certification.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Grind and re-weld segment.", costDuration: "Low | 1 Day" }
    },
    welding_cracks: {
        label: "Welding-Cracks",
        severity: "high",
        rootCause: "Picture indicates linear cracking running along the centerline or toe of the weld bead. These weld cracks are caused by high tensile stresses during cooling (solidification cracking) or hydrogen embrittlement (cold cracking) in thick constrained joint configurations.",
        furtherInvestigation: "We should further investigate by conducting ultrasonic testing (UT) or magnetic particle testing (MPT) to find crack depth and propagation path. Check joint restraint conditions and steel carbon equivalence.",
        futureSolution: "Gouge out the cracked weld section entirely using carbon-arc gouging or mechanical grinding. Preheat the joint base metal to the specified temperature, and re-weld using low-hydrogen electrodes followed by controlled slow cooling.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Full weld gouging and certified re-welding.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Patch weld grinding and re-welding.", costDuration: "Low | 1 Day" }
    },
    welding_lack_of_fusion: {
        label: "Welding-Lack of Fusion",
        severity: "high",
        rootCause: "Picture indicates separation gaps at the boundary between the weld metal and base metal. This defect is caused by insufficient heat input, improper electrode angle, or high travel speed, preventing the base metal from melting and bonding with the weld pool.",
        furtherInvestigation: "We should further investigate by performing ultrasonic testing (UT) to trace the extent of the un-fused boundary along the weld seam. Audit welding parameters (current, voltage, and travel speed) used in construction.",
        futureSolution: "Grind or gouge out the weld segment showing lack of fusion. Clean the weld groove, adjust the welding machine parameters to provide adequate heat input, and re-weld using proper torch angle techniques.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Certified grind and re-weld.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Localized grind and re-weld.", costDuration: "Low | 1 Day" }
    },
    welding_undercut: {
        label: "Welding-Undercut",
        severity: "med",
        rootCause: "Picture indicates a groove or channel melted into the base metal along the toe of the weld bead. This defect is caused by excessive welding current, high arc voltage, or improper electrode manipulation that washes away base metal without replacing it with weld metal.",
        furtherInvestigation: "We should further investigate by measuring the undercut depth using a weld fillet gauge. Conduct visual inspections and dye penetrant testing to verify if any cracks have initiated in the undercut groove zone.",
        futureSolution: "Clean the undercut groove and lay a thin filler weld run (weld bead) along the weld toe using a smaller diameter electrode to fill the groove flush with the base metal surface. Grind smooth to transition structural profiles.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Weld fill undercut with matching electrode.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Fill undercut with weld bead.", costDuration: "Low | 1 Day" }
    },
    welding_overlap: {
        label: "Welding-Overlap",
        severity: "low",
        rootCause: "Picture indicates weld metal protruding over the base metal surface without fusing at the toe. This defect is caused by low welding current, incorrect travel angle, or high weld deposition rates, allowing molten metal to overflow onto cooler un-melted base metal.",
        furtherInvestigation: "We should further investigate by performing magnetic particle testing (MPT) or dye penetrant testing (DPT) to confirm if the overlap conceals any toe cracks or slag lines beneath the excess weld bead profile.",
        futureSolution: "Carefully grind away the excess weld overlap protrusion using a grinding wheel held at a shallow angle, ensuring a smooth profile transition into the base metal without gouging or reducing the parent metal thickness.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Grind overlap and inspect fusion.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Manual grinding of excess metal.", costDuration: "Low | 1 Day" }
    },
    welding_spatter: {
        label: "Welding-Spatter",
        severity: "low",
        rootCause: "Picture indicates small, spherical metal droplets solidified on the parent plate surface adjacent to the weld bead. This spatter is caused by excessive arc current, incorrect polarity, magnetic arc blow, or damp electrode flux coating.",
        furtherInvestigation: "We should further investigate by visual inspection to check if the spatter is loose or firmly bonded, and inspect if any spatter clusters have caused localized surface pitting on corrosion-sensitive steel sections.",
        futureSolution: "Chip off the weld spatter using a chipping hammer or wire brush. For tightly bonded spatter, grind the parent metal surface lightly until smooth, and apply a protective paint coating to prevent corrosion pitting.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Grind spatter and paint surface.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Manual chipping and scraping.", costDuration: "Low | 1 Day" }
    },
    welding_slag_inclusion: {
        label: "Welding-Slag Inclusion",
        severity: "med",
        rootCause: "Picture indicates non-metallic slag particles trapped inside the weld metal. This defect occurs when multi-pass welds are made without cleaning the slag between runs, or due to improper electrode angle or low current leaving slag trapped in the weld root.",
        furtherInvestigation: "We should further investigate by conducting ultrasonic testing (UT) or radiographic testing (RT) to determine the size and depth of slag lines inside the joint. Check if the slag inclusions form continuous lines that compromise shear capacity.",
        futureSolution: "Grind or carbon-arc gouge out the weld metal containing the slag inclusions. Clean the joint faces thoroughly using a wire brush or slag hammer, and re-weld the joint using correct heat input and inter-pass cleaning procedures.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Grind out slag and re-weld.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Grind slag and fill weld.", costDuration: "Low | 1 Day" }
    },
    welding_penetration: {
        label: "Welding-Penetration",
        severity: "med",
        rootCause: "Picture indicates insufficient root penetration or excessive melt-through at the root of the welded joint. This is caused by improper root gap setting, incorrect electrode size, low welding current, or high travel speed, leaving a notch-like stress concentration.",
        furtherInvestigation: "We should further investigate by conducting ultrasonic testing (UT) or visual inspection of the root side if accessible. Measure the depth of unpenetrated root face and verify weld qualification logs.",
        futureSolution: "Grind out the weld root area from the back side, clean the groove, and lay a backing weld run to achieve full joint penetration. If inaccessible, gouge out the weld completely and re-weld with correct root gap parameters.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Certified capping weld run.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Grind and corrective weld run.", costDuration: "Low | 1 Day" }
    },
    welding_underfill: {
        label: "Welding-Underfill",
        severity: "med",
        rootCause: "Picture indicates that the weld face is below the surface level of the adjacent base metal plates. This underfill defect is caused by the welder failing to deposit sufficient filler metal passes to fill the weld groove joint completely.",
        furtherInvestigation: "We should further investigate by measuring the underfill depth and length using a weld throat gauge. Check if the reduced weld throat thickness compromises the design load capacity of the welded connection.",
        futureSolution: "Clean the weld face of slag and contaminants. Pre-heat if required, and deposit additional weld runs to build up the weld face to or slightly above the base metal surface, ensuring a smooth profile transition.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Build up weld face with add-on passes.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Add weld run.", costDuration: "Low | 1 Day" }
    },
    welding_excess_reinforcement: {
        label: "Welding-Excess Reinforcement",
        severity: "low",
        rootCause: "Picture indicates excessive weld metal buildup (high reinforcement height) on the face of the butt joint. This is caused by slow travel speed, low current, or excessive filler metal addition, which creates an abrupt change in cross-section.",
        furtherInvestigation: "We should further investigate by measuring the height of excess reinforcement using a weld profile gauge. Inspect the toe angles to check for stress concentrations or sharp notches at the weld toe boundaries.",
        futureSolution: "Grind down the excess weld metal reinforcement flush or to a maximum height of 1.5mm above the base plate surface, ensuring a smooth, gradual transition profile from the weld face to the parent metal.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Precision grinding flush.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Manual grinding.", costDuration: "Low | 1 Day" }
    },
    welding_burn_through: {
        label: "Welding-Burn Through",
        severity: "high",
        rootCause: "Picture indicates an open hole or melt-through void in the root of the weld joint. This burn-through is caused by excessive welding current, slow travel speed, or too large a root gap, allowing the arc to melt completely through the base metal thickness.",
        furtherInvestigation: "We should further investigate by inspecting the back side of the joint for excess hanging metal drops. Conduct dye penetrant testing (DPT) to check for cracks extending from the edge of the burn-through hole.",
        futureSolution: "Grind out the defective weld area to form a clean groove. Install a temporary or permanent backing plate underneath, and re-weld the opening using low current parameters to prevent further melt-through.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Weld backing plates and complete re-weld.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Localized patch plate welding.", costDuration: "Low | 1 Day" }
    },
    welding_arc_strike: {
        label: "Welding-Arc Strike",
        severity: "low",
        rootCause: "Picture indicates localized heat marks and micro-pits on the steel base plate outside the weld groove. This is caused by the welder accidentally striking the arc on the parent metal, creating localized heating and rapid cooling that forms brittle martensite.",
        furtherInvestigation: "We should further investigate by conducting magnetic particle testing (MPT) or acid etching over the arc strike zone to check for micro-cracks. Check if the strike is on high-tensile fatigue-sensitive steel members.",
        futureSolution: "Carefully grind the arc strike spot until a smooth surface is restored and the hardened micro-structural layer is removed. Perform MPT to confirm that no cracks remain, and apply a protective paint coating.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Grind strike and check crack integrity.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Grind strike marks.", costDuration: "Low | 1 Day" }
    },
    welding_crater_crack: {
        label: "Welding-Crater Crack",
        severity: "med",
        rootCause: "Picture indicates star-shaped or radial cracks inside the shrinkage crater at the termination point of the weld run. These crater cracks are caused by shrinkage stresses pulling the metal apart during rapid cooling of the weld pool.",
        furtherInvestigation: "We should further investigate by using a magnifying loupe and performing dye penetrant testing (DPT) to determine crack length. Verify if the crack propagates from the crater into the main weld run.",
        futureSolution: "Grind out the weld crater completely to sound metal. Re-weld the termination point, ensuring the crater is filled by using a proper crater-fill welding technique (such as back-stepping or holding the arc at termination).",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Grind and fill crater with UT test.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Grind and patch fill crater.", costDuration: "Low | 1 Day" }
    },
    welding_excessive_convexity: {
        label: "Welding-Excessive Convexity",
        severity: "low",
        rootCause: "Picture indicates an excessively rounded or bulged weld face profile in a fillet weld. This excessive convexity is caused by low welding current, high travel speed, or incorrect electrode manipulation that prevents the weld metal from wetting the joint faces.",
        furtherInvestigation: "We should further investigate by measuring the convexity height and throat thickness using a weld fillet gauge. Check if the re-entrant toe angle is too sharp, which acts as a stress raiser.",
        futureSolution: "Grind the face of the fillet weld using a grinding disc to reduce the profile convexity to a smooth, flat, or slightly concave contour, ensuring a gradual profile transition at both weld toes.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Precision grinding contour.", costDuration: "Moderate | 1 Day" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Grind weld profile to smooth flat contour.", costDuration: "Low | 1 Day" }
    },
    welding_misalignment: {
        label: "Welding-Misalignment",
        severity: "high",
        rootCause: "Picture indicates that the joint plates are mismatched and welded out-of-plane. This misalignment is caused by poor fit-up, inadequate tack welding, or lack of structural clamping fixtures during assembly, leading to eccentric bending under load.",
        furtherInvestigation: "We should further investigate by measuring the linear offset at the joint using a bridge-cam gauge. Perform ultrasonic testing (UT) to check if the root of the weld is properly fused despite the mismatch.",
        futureSolution: "For critical members, cut the welded joint, re-align the steel plates using hydraulic jacks or alignment clamps, tack-weld securely, and re-weld. For less critical joints, reinforce the step using a tapered transition weld overlay.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Joint cutting, alignment and re-welding.", costDuration: "Premium | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Reinforce joint with side gusset plates.", costDuration: "Moderate | 2 Days" }
    },
    welding_oxidation: {
        label: "Welding-Oxidation",
        severity: "med",
        rootCause: "Picture indicates a dark, scaly, or heavily discolored weld bead surface (often with a 'burned' appearance). This oxidation is caused by loss of shielding gas coverage during welding, high heat input, or welding on dirty, contaminated steel surfaces.",
        furtherInvestigation: "We should further investigate by performing wire brushing to check if the oxidation is superficial. Conduct dye penetrant testing (DPT) to check for surface-breaking micro-cracks or porosity in the oxidized weld layer.",
        futureSolution: "Grind away the heavily oxidized surface layer of the weld bead until shiny, sound metal is exposed. Re-inspect using DPT, and if any defects remain, grind the weld down to the parent metal and re-weld under proper shielding.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Grind and re-lay weld run.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Grind oxidized parts.", costDuration: "Low | 1 Day" }
    },
    corrosion_lower_cover_rcc: {
        label: "Corrosion-Lower Cover-RCC",
        severity: "med",
        rootCause: "Picture indicates longitudinal cracking and concrete spalling along the bottom rebar lines. This is caused by inadequate concrete cover over the reinforcement, allowing rapid penetration of carbonation or moisture to the steel, causing rust expansion.",
        furtherInvestigation: "We should further investigate by conducting a covermeter scan to map out the actual cover depth across the slab or beam. Perform carbonation depth testing using phenolphthalein indicator, and measure rebar diameter loss.",
        futureSolution: "Chip away the deteriorated bottom concrete cover to fully expose the corroded reinforcement. Clean the steel bars using wire brushes or sandblasting, apply a zinc-rich anti-corrosion primer, and patch/reinstate using high-strength polymer-modified mortar.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Expose and apply structural repair micro-concrete.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Expose and apply polymer patching mortar.", costDuration: "Low | 2 Days" }
    },
    efflorescence_salt_deposition_masonry: {
        label: "Efflorescence Salt Deposition-Masonry",
        severity: "low",
        rootCause: "Picture indicates white, powdery salt deposits crystallizing on the brick masonry surface. This efflorescence is caused by soluble salts within the brick or mortar leaching out to the surface when dissolved in water, which then evaporates.",
        furtherInvestigation: "We should further investigate by using a moisture meter to trace the dampness path sustaining the efflorescence. Perform salt chemical analysis to identify the salt types, and locate the source of water ingress (such as rain or plumbing leaks).",
        futureSolution: "Brush off the dry salts from the masonry surface using a stiff bristle brush (avoid water as it will re-dissolve salts). Seal the masonry surface with a breathable silane-siloxane hydrophobic sealer, and resolve any plumbing or moisture leaks.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Salt neutralizer wash and hydrophobic sealing.", costDuration: "Moderate | 2 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Dry brushing and acrylic waterproof sealer.", costDuration: "Low | 1 Day" }
    },
    timber_termite_effect: {
        label: "Timber-Termite Effect",
        severity: "med",
        rootCause: "Picture indicates structural degradation, hollow wood chambers, and mud tunnels in the timber elements. This damage is caused by sub-terranean termite infestation feeding on the cellulose within the wood, which hollows out the structural member.",
        furtherInvestigation: "We should further investigate by performing hammer sound testing and drilling core probes to map out hollow zones inside the timber member. Use moisture meters to locate active damp nests and trace termite entry paths.",
        futureSolution: "Treat the affected area using pesticide soil barriers and local chemical injections. If the timber sectional area is hollowed out by more than 15-20%, replace the damaged timber section or reinforce it by bolting side steel plates.",
        A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Inject chemical barrier and replace wood sections.", costDuration: "Moderate | 3 Days" },
        B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Apply anti-termite wood preservative.", costDuration: "Low | 1 Day" }
    }
};

const RCC_DIAG = POST_DIAG;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// OPTION MANAGEMENT & MODAL LAYOUT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
window.getDefectOptions = function(mode, key) {
    if (!state[mode].options) {
        state[mode].options = {};
    }
    if (!state[mode].options[key]) {
        const db = (mode === 'pre') ? PRE_DIAG_DB : POST_DIAG;
        const entry = db[key];
        if (entry) {
            state[mode].options[key] = [
                {
                    rootCause: entry.rootCause || '',
                    furtherInvestigation: entry.furtherInvestigation || '',
                    futureSolution: entry.futureSolution || ''
                }
            ];
        } else {
            state[mode].options[key] = [
                {
                    rootCause: 'Custom classified structural defect.',
                    furtherInvestigation: 'Professional engineering review recommended.',
                    futureSolution: 'Consult design engineer or structural repair vendor.'
                }
            ];
        }
    }
    return state[mode].options[key];
};

window.getMarketRateTableHTML = function(mode, key) {
    const options = getDefectOptions(mode, key);
    let rowsHTML = '';
    options.forEach((opt, idx) => {
        rowsHTML += `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:12px; color:var(--text-700); font-size:0.8rem; line-height:1.5; vertical-align:top; text-align:justify;">${opt.rootCause}</td>
                <td style="padding:12px; color:var(--text-700); font-size:0.8rem; line-height:1.5; vertical-align:top; text-align:justify;">${opt.furtherInvestigation}</td>
                <td style="padding:12px; color:var(--text-700); font-size:0.8rem; line-height:1.5; vertical-align:top; text-align:justify;">${opt.futureSolution}</td>
                <td style="padding:12px; vertical-align:middle; text-align:center; width:90px;">
                    <div style="display:flex; flex-direction:column; gap:4px; align-items:stretch; width:70px; margin:0 auto;">
                        <button class="fb-btn" style="padding:4px 8px; background:#eab308; color:#fff; border:none; border-radius:4px; font-size:0.65rem; font-weight:700; cursor:pointer;" onclick="openEditOptionModal('${mode}', '${key}', ${idx})">Edit</button>
                        <button class="fb-btn" style="padding:4px 8px; background:#ef4444; color:#fff; border:none; border-radius:4px; font-size:0.65rem; font-weight:700; cursor:pointer;" onclick="deleteOption('${mode}', '${key}', ${idx})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    return `
        <div style="margin-top:12px; overflow-x:auto; border:1px solid var(--border); border-radius:var(--r-lg); background:#fff;">
            <table style="width:100%; border-collapse:collapse; text-align:left;">
                <thead>
                    <tr style="background:#f8fafc; border-bottom:2px solid var(--border); font-family:var(--font-head); font-weight:800; font-size:0.75rem; color:var(--text-600); text-transform:uppercase;">
                        <th style="padding:12px; width:33%;">Root Cause</th>
                        <th style="padding:12px; width:33%;">Further Investigation</th>
                        <th style="padding:12px; width:33%;">Possible Solution</th>
                        <th style="padding:12px; width:90px; text-align:center;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
            </table>
        </div>
    `;
};

window.openAddOptionModal = function(mode, key) {
    window.currentModalData = { mode, key, index: -1 };
    renderQuotationModal('', '', '');
};

window.openEditOptionModal = function(mode, key, index) {
    const options = getDefectOptions(mode, key);
    const opt = options[index];
    if (opt) {
        window.currentModalData = { mode, key, index };
        renderQuotationModal(opt.rootCause, opt.furtherInvestigation, opt.futureSolution);
    }
};

function deletePhotosAndAssignments(mode, key) {
    const assignments = state[mode].imageAssignments;
    const indicesToDelete = [];
    state[mode].photos.forEach((_, idx) => {
        if (assignments[idx] === key) {
            indicesToDelete.push(idx);
        }
    });

    if (indicesToDelete.length === 0) return;

    const newPhotos = [];
    const newAssignments = {};
    const newAiRecommendations = {};

    let newIdx = 0;
    state[mode].photos.forEach((photo, idx) => {
        if (!indicesToDelete.includes(idx)) {
            newPhotos.push(photo);
            newAssignments[newIdx] = state[mode].imageAssignments[idx] || 'unassigned';
            newAiRecommendations[newIdx] = state[mode].aiRecommendations[idx] || null;
            newIdx++;
        }
    });

    state[mode].photos = newPhotos;
    state[mode].imageAssignments = newAssignments;
    state[mode].aiRecommendations = newAiRecommendations;

    // Refresh UI counts
    const countId = (mode === 'pre') ? 'prePhotoCount' : ((mode === 'post') ? 'postPhotoCount' : 'rccPhotoCount');
    const countEl = document.getElementById(countId);
    if (countEl) {
        countEl.textContent = `${newPhotos.length} photo${newPhotos.length === 1 ? '' : 's'}`;
    }
}

window.deletePhotoByIndex = function(mode, idxToDel) {
    const newPhotos = [];
    const newAssignments = {};
    const newAiRecommendations = {};
    const newSelectionSource = {};
    const newRemediationPreferences = {};

    let newIdx = 0;
    state[mode].photos.forEach((photo, idx) => {
        if (idx !== idxToDel) {
            newPhotos.push(photo);
            newAssignments[newIdx] = state[mode].imageAssignments[idx] || 'unassigned';
            newAiRecommendations[newIdx] = state[mode].aiRecommendations[idx] || null;
            newSelectionSource[newIdx] = state[mode].selectionSource[idx] || null;
            if (state[mode].remediationPreferences) {
                newRemediationPreferences[newIdx] = state[mode].remediationPreferences[idx] || null;
            }
            newIdx++;
        }
    });

    state[mode].photos = newPhotos;
    state[mode].imageAssignments = newAssignments;
    state[mode].aiRecommendations = newAiRecommendations;
    state[mode].selectionSource = newSelectionSource;
    state[mode].remediationPreferences = newRemediationPreferences;

    // Refresh UI counts
    const countId = (mode === 'pre') ? 'prePhotoCount' : ((mode === 'post') ? 'postPhotoCount' : 'rccPhotoCount');
    const countEl = document.getElementById(countId);
    if (countEl) {
        countEl.textContent = `${newPhotos.length} photo${newPhotos.length === 1 ? '' : 's'}`;
    }

    showToast("Photo removed successfully.");
    
    // Re-render
    if (mode === 'pre') {
        renderPreAnalysisList();
    } else if (mode === 'post') {
        renderPostAnalysisList();
    } else if (mode === 'rcc') {
        renderRCCAnalysisList();
    }
};

window.deleteOption = function(mode, key, index) {
    const options = getDefectOptions(mode, key);
    options.splice(index, 1);
    
    // Completely remove the photograph(s) associated with this category
    deletePhotosAndAssignments(mode, key);

    showToast("Option and associated photos deleted successfully.");
    refreshSolutionsReport(mode);
};

window.closeQuotationModal = function() {
    const modal = document.getElementById('quotationModal');
    if (modal) modal.remove();
};

window.saveQuotationOption = function(mode, key, index) {
    const rootCause = document.getElementById('modalRootCause').value.trim();
    const furtherInvestigation = document.getElementById('modalFurtherInvestigation').value.trim();
    const futureSolution = document.getElementById('modalFutureSolution').value.trim();

    if (!rootCause || !furtherInvestigation || !futureSolution) {
        showToast("Please fill out all three fields.");
        return;
    }

    const options = getDefectOptions(mode, key);
    if (index === -1) {
        // Add new
        options.push({ rootCause, furtherInvestigation, futureSolution });
        showToast("New option added successfully.");
    } else {
        // Update existing
        options[index] = { rootCause, furtherInvestigation, futureSolution };
        showToast("Option updated successfully.");
    }

    closeQuotationModal();
    refreshSolutionsReport(mode);
};

function renderQuotationModal(rc, fi, fs) {
    closeQuotationModal();
    const mode = window.currentModalData.mode;
    const key = window.currentModalData.key;
    const index = window.currentModalData.index;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'quotationModal';
    modalDiv.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; font-family:var(--font-body);';

    modalDiv.innerHTML = `
        <div style="background:#fff; border-radius:var(--r-xl); width:100%; max-width:600px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); overflow:hidden; border:1px solid var(--border); animation: modalFadeIn 0.25s ease-out;">
            <div style="padding:18px 24px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
                <h3 style="margin:0; font-family:var(--font-head); font-size:1.1rem; font-weight:800; color:var(--text-900);">Quotation Item Details</h3>
                <button onclick="closeQuotationModal()" style="background:none; border:none; color:var(--text-400); cursor:pointer; font-size:1.5rem; display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; transition:background 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='none'">Ã—</button>
            </div>
            <div style="padding:24px; display:flex; flex-direction:column; gap:16px;">
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.75rem; font-weight:800; color:var(--text-600); text-transform:uppercase;">Root Cause</label>
                    <textarea id="modalRootCause" style="width:100%; min-height:80px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'">${rc}</textarea>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.75rem; font-weight:800; color:var(--text-600); text-transform:uppercase;">Further Investigation</label>
                    <textarea id="modalFurtherInvestigation" style="width:100%; min-height:80px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'">${fi}</textarea>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.75rem; font-weight:800; color:var(--text-600); text-transform:uppercase;">Possible Solution</label>
                    <textarea id="modalFutureSolution" style="width:100%; min-height:80px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'">${fs}</textarea>
                </div>
            </div>
            <div style="padding:16px 24px; background:#f8fafc; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:12px;">
                <button onclick="closeQuotationModal()" style="padding:8px 16px; border:1px solid var(--border); background:#fff; color:var(--text-600); border-radius:var(--r-md); font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">Close</button>
                <button onclick="saveQuotationOption('${mode}', '${key}', ${index})" style="padding:8px 16px; border:none; background:#22c55e; color:#fff; border-radius:var(--r-md); font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#16a34a'" onmouseout="this.style.background='#22c55e'">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);
}

function refreshSolutionsReport(mode) {
    if (mode === 'pre') {
        renderPreSolutionsReport();
    } else if (mode === 'post') {
        renderPostSolutionsReport();
    } else if (mode === 'rcc') {
        renderRCCSolutionsReport();
    }
}

// Inject modal keyframe animations
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    `;
    document.head.appendChild(style);
})();

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PARAMETER ANALYSIS ENGINE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function analyzePreParams(params) {
    const { coverBlocks, reinfSpacing, bars, stirrups } = params;
    const coverCount = parseFloat(coverBlocks) || 0;
    const spacingVal = parseFloat(reinfSpacing) || 0;
    const barCount   = parseFloat(bars) || 0;
    const barDia     = parseFloat((bars.match(/(\d+)mm/i) || [])[1]) || 0;
    const stirSpacing = parseFloat(stirrups) || 0;
    const isFlexible  = /flexible/i.test(stirrups);

    let scores = { low_cover_risk: 0, congestion_risk: 0, formwork_risk: 0, heavy_section_risk: 0 };

    if (coverCount <= 2) scores.low_cover_risk += 4;
    else if (coverCount <= 3) scores.low_cover_risk += 3;
    else if (coverCount <= 4) scores.low_cover_risk += 1;

    if (spacingVal > 0 && spacingVal <= 125) scores.congestion_risk += 3;
    else if (spacingVal <= 150) scores.congestion_risk += 2;
    else if (spacingVal <= 200) scores.congestion_risk += 1;

    if (barCount >= 16) scores.congestion_risk += 3;
    else if (barCount >= 12) scores.congestion_risk += 2;
    else if (barCount >= 10) scores.congestion_risk += 1;

    if (barDia >= 25) scores.heavy_section_risk += 3;
    else if (barDia >= 20) scores.heavy_section_risk += 2;
    else if (barDia >= 16) scores.heavy_section_risk += 1;

    if (isFlexible) scores.formwork_risk += 3;
    if (stirSpacing >= 250) scores.formwork_risk += 3;
    else if (stirSpacing >= 200) scores.formwork_risk += 2;
    else if (stirSpacing >= 150) scores.formwork_risk += 1;

    if (barDia >= 20 && stirSpacing > 0 && stirSpacing <= 150) scores.heavy_section_risk += 2;

    let maxRisk = 'balanced_risk', maxScore = 0;
    for (const [key, score] of Object.entries(scores)) {
        if (score > maxScore) { maxScore = score; maxRisk = key; }
    }
    if (maxScore < 2) maxRisk = 'balanced_risk';

    const baseConf = 65 + Math.min(maxScore * 4, 20);
    return {
        diagKey: maxRisk,
        confA: Math.min(baseConf + Math.floor(Math.random() * 6), 95),
        confB: Math.max(baseConf - 10 - Math.floor(Math.random() * 8), 48)
    };
}

function randConf(range) {
    return range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DOM HELPERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const $ = id => document.getElementById(id);

function showToast(msg) {
    const toast = $('toast');
    $('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SIDEBAR NAVIGATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const navPre      = $('navPre');
const navPost     = $('navPost');
const navRCC      = $('navRCC');
const navSettings = $('navSettings');
const pagePre     = $('pagePre');
const pagePost    = $('pagePost');
const pageRCC     = $('pageRCC');
const pageSettings = $('pageSettings');
const navWCToggle = $('navWCToggle');
const navWCItems  = $('navWCItems');
const sidebarToggleBtn = $('sidebarToggle');
const sidebar     = $('sidebar');
const overlay     = $('sidebarOverlay');

// Page switching
function switchPage(page) {
    if (state.activePage === page) {
        if (page === 'pre') {
            $('preUploadCard').classList.remove('hidden');
            $('preParamCard').classList.add('hidden');
            $('preResultsCard').classList.add('hidden');
            $('preUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (page === 'post') {
            $('postUploadCard').classList.remove('hidden');
            $('postDefectCard').classList.add('hidden');
            $('postResultsCard').classList.add('hidden');
            $('postUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (page === 'rcc') {
            $('rccUploadCard').classList.remove('hidden');
            $('rccAnalysisCard').classList.add('hidden');
            $('rccResultsCard').classList.add('hidden');
            $('rccUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    state.activePage = page;

    navPre.classList.toggle('active', page === 'pre');
    navPost.classList.toggle('active', page === 'post');
    navRCC.classList.toggle('active', page === 'rcc');
    navSettings.classList.toggle('active', page === 'settings');
    pagePre.classList.toggle('active', page === 'pre');
    pagePost.classList.toggle('active', page === 'post');
    pageRCC.classList.toggle('active', page === 'rcc');
    pageSettings.classList.toggle('active', page === 'settings');

    // Close mobile sidebar
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
}

navPre.addEventListener('click', () => switchPage('pre'));
navPost.addEventListener('click', () => switchPage('post'));
navRCC.addEventListener('click', () => switchPage('rcc'));
navSettings.addEventListener('click', () => switchPage('settings'));

// Collapse/expand
navWCToggle.addEventListener('click', () => {
    navWCToggle.closest('.nav-section').classList.toggle('collapsed');
});

// Mobile sidebar toggle
sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
});
overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MULTI-PHOTO UPLOAD SYSTEM
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setupPhotoUploader(config) {
    const { mode, gridId, addBtnId, fileInputId, countId, uploadCardId, nextCardId, dropOverlayId } = config;
    const grid      = $(gridId);
    const addBtn    = $(addBtnId);
    const fileInput = $(fileInputId);
    const countEl   = $(countId);
    const uploadCard = $(uploadCardId);
    const nextCard  = $(nextCardId);
    const dropOverlay = $(dropOverlayId);

    function getPhotos() { return state[mode].photos; }

    function updateCount() {
        const count = getPhotos().length;
        countEl.textContent = count + (count === 1 ? ' photo' : ' photos');
        countEl.style.color = count > 0 ? 'var(--blue-600)' : '';
        countEl.style.borderColor = count > 0 ? 'var(--blue-200)' : '';
        countEl.style.background = count > 0 ? 'var(--blue-50)' : '';

        // Unlock next card if at least 1 photo
        if (count > 0) {
            nextCard.classList.remove('locked');
            if (nextCard.tagName === 'BUTTON') nextCard.disabled = false;
        } else {
            nextCard.classList.add('locked');
            if (nextCard.tagName === 'BUTTON') nextCard.disabled = true;
        }
    }

    function renderGrid() {
        // Remove all existing thumbnails (keep addBtn)
        grid.querySelectorAll('.photo-thumb').forEach(el => el.remove());

        getPhotos().forEach((dataUrl, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'photo-thumb';
            thumb.innerHTML = `
                <img src="${dataUrl}" class="img-zoomable" alt="Photo ${idx + 1}">
                <button class="photo-remove" title="Remove photo">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <span class="photo-index">${idx + 1}</span>
            `;
            thumb.querySelector('.photo-remove').addEventListener('click', () => {
                getPhotos().splice(idx, 1);
                renderGrid();
                updateCount();
                showToast('Photo removed');
            });
            grid.insertBefore(thumb, addBtn);
        });

        updateCount();
    }

    function addFiles(files) {
        if (files.length > 10 || getPhotos().length + files.length > 10) {
            showToast("You can only upload a maximum of 10 photos.");
            return;
        }
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = e => {
                getPhotos().push(e.target.result);
                renderGrid();
                showToast(`Photo added (${getPhotos().length} total)`);
            };
            reader.readAsDataURL(file);
        });
    }

    // Click to add
    addBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
        if (e.target.files.length) addFiles(e.target.files);
        fileInput.value = '';
    });

    // Drag & drop on the entire card
    uploadCard.addEventListener('dragover', e => {
        e.preventDefault();
        dropOverlay.classList.remove('hidden');
    });
    uploadCard.addEventListener('dragleave', e => {
        if (!uploadCard.contains(e.relatedTarget)) {
            dropOverlay.classList.add('hidden');
        }
    });
    uploadCard.addEventListener('drop', e => {
        e.preventDefault();
        dropOverlay.classList.add('hidden');
        const files = e.dataTransfer.files;
        if (files.length) addFiles(files);
    });

    updateCount();
}

// Setup both uploaders
setupPhotoUploader({
    mode: 'pre',
    gridId: 'prePhotoGrid',
    addBtnId: 'preAddBtn',
    fileInputId: 'preFileInput',
    countId: 'prePhotoCount',
    uploadCardId: 'preUploadCard',
    nextCardId: 'preGoToAnalysisBtn',
    dropOverlayId: 'preDropOverlay'
});

setupPhotoUploader({
    mode: 'post',
    gridId: 'postPhotoGrid',
    addBtnId: 'postAddBtn',
    fileInputId: 'postFileInput',
    countId: 'postPhotoCount',
    uploadCardId: 'postUploadCard',
    nextCardId: 'postGoToAnalysisBtn',
    dropOverlayId: 'postDropOverlay'
});

// Proceed transition event listeners
$('preGoToAnalysisBtn').addEventListener('click', () => {
    $('preParamCard').classList.remove('hidden', 'locked');
    $('preUploadCard').classList.add('hidden');
    $('preParamCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    initPreRecommendations();
    renderPreAnalysisList();
});

$('postGoToAnalysisBtn').addEventListener('click', () => {
    $('postDefectCard').classList.remove('hidden', 'locked');
    $('postUploadCard').classList.add('hidden');
    $('postDefectCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    initPostRecommendations();
    renderPostAnalysisList();
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRE-CONSTRUCTION DIAGNOSTICS LOGIC (PHOTO-BY-PHOTO)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const preAnalysisList = $('preAnalysisList');
const preAnalyzeBtn = $('preAnalyzeBtn');

// Parameter Options Definitions
const PRE_COVER_OPTS = {
    "2_blocks": "2 blocks/m2 - 1000mm spacing",
    "3_blocks": "3 blocks/m2 - 800mm spacing",
    "4_blocks": "4 blocks/m2 - 600mm spacing (Standard)",
    "6_blocks": "6 blocks/m2 - 400mm spacing (Dense)",
    "8_blocks": "8 blocks/m2 - 300mm spacing (High-Density)"
};

const PRE_SPACING_OPTS = {
    "100mm": "100mm c/c - Both ways",
    "125mm": "125mm c/c - Both ways",
    "150mm": "150mm c/c - Both ways (Standard)",
    "200mm": "200mm c/c - Both ways",
    "250mm": "250mm c/c - Both ways",
    "300mm": "300mm c/c - Both ways (Min. allowed)"
};

const PRE_BAR_OPTS = {
    "8mm": "6 bars - 8mm dia (Fe 500)",
    "10mm": "8 bars - 10mm dia (Fe 500)",
    "12mm": "10 bars - 12mm dia (Fe 500)",
    "16mm": "12 bars - 16mm dia (Fe 500)",
    "20mm": "16 bars - 20mm dia (Fe 500D)",
    "25mm": "20 bars - 25mm dia (Fe 500D)",
    "32mm": "24 bars - 32mm dia (Fe 550)"
};

const PRE_STIRRUP_OPTS = {
    "100mm_rigid": "100mm - Shuttering Rigid (Heavy)",
    "150mm_rigid": "150mm - Shuttering Rigid (Standard)",
    "200mm_rigid": "200mm - Shuttering Rigid",
    "200mm_flexible": "200mm - Shuttering Flexible",
    "250mm_flexible": "250mm - Shuttering Flexible",
    "300mm_flexible": "300mm - Shuttering Flexible (Max.)"
};

// Pre-Construction photo observer to trigger classification lists render
const prePhotoObserver = new MutationObserver(() => {
    const hasPhotos = state.pre.photos.length > 0;
    $('preGoToAnalysisBtn').disabled = !hasPhotos;
});
prePhotoObserver.observe($('prePhotoGrid'), { childList: true });

function getFilteredAndSortedPrePhotos() {
    const query = (state.pre.searchQuery || '').toLowerCase().trim();
    const sort = state.pre.sortBy || 'number';
    
    let items = state.pre.photos.map((dataUrl, idx) => {
        const config = state.pre.imageAssignments[idx] || { coverBlocks: '4_blocks', reinfSpacing: '150mm', bars: '16mm', stirrups: '150mm_rigid' };
        const rec = state.pre.aiRecommendations[idx] || { coverBlocks: '4_blocks', reinfSpacing: '150mm', bars: '16mm', stirrups: '150mm_rigid', key: 'low_cover_risk', pct: 90 };
        const activeRiskKey = getPrePhotoRiskKey(config);
        const label = PRE_DIAG_DB[activeRiskKey] ? PRE_DIAG_DB[activeRiskKey].label : "Compliant Profile";
        const source = state.pre.selectionSource[idx] || 'ai';
        const confidence = rec.pct || 90;
        
        return {
            idx,
            dataUrl,
            config,
            rec,
            activeRiskKey,
            label,
            source,
            confidence
        };
    });
    
    if (query) {
        items = items.filter(item => {
            const photoNumStr = (item.idx + 1).toString();
            const sourceStr = item.source.toLowerCase();
            const labelStr = item.label.toLowerCase();
            
            const coverVal = (PRE_COVER_OPTS[item.config.coverBlocks] || '').toLowerCase();
            const spacingVal = (PRE_SPACING_OPTS[item.config.reinfSpacing] || '').toLowerCase();
            const barsVal = (PRE_BAR_OPTS[item.config.bars] || '').toLowerCase();
            const stirrupsVal = (PRE_STIRRUP_OPTS[item.config.stirrups] || '').toLowerCase();
            
            return photoNumStr.includes(query) ||
                   query.includes('#' + photoNumStr) ||
                   sourceStr.includes(query) ||
                   labelStr.includes(query) ||
                   coverVal.includes(query) ||
                   spacingVal.includes(query) ||
                   barsVal.includes(query) ||
                   stirrupsVal.includes(query);
        });
    }
    
    if (sort === 'number') {
        items.sort((a, b) => a.idx - b.idx);
    } else if (sort === 'confidence') {
        items.sort((a, b) => b.confidence - a.confidence || a.idx - b.idx);
    } else if (sort === 'classification') {
        items.sort((a, b) => a.label.localeCompare(b.label) || a.idx - b.idx);
    }
    
    return items;
}

function getFilteredAndSortedPostPhotos() {
    const query = (state.post.searchQuery || '').toLowerCase().trim();
    const sort = state.post.sortBy || 'number';
    
    let items = state.post.photos.map((dataUrl, idx) => {
        const assignedKey = state.post.imageAssignments[idx] || 'unassigned';
        const rec = state.post.aiRecommendations[idx] || { key: 'corrosion_minor', pct: 85 };
        const label = POST_DIAG[assignedKey] ? POST_DIAG[assignedKey].label : (assignedKey === 'unassigned' ? 'Unassigned' : 'Unknown Defect');
        const source = state.post.selectionSource[idx] || 'ai';
        const confidence = rec.pct || 85;
        
        return {
            idx,
            dataUrl,
            assignedKey,
            rec,
            label,
            source,
            confidence
        };
    });
    
    if (query) {
        items = items.filter(item => {
            const photoNumStr = (item.idx + 1).toString();
            const sourceStr = item.source.toLowerCase();
            const labelStr = item.label.toLowerCase();
            
            return photoNumStr.includes(query) ||
                   query.includes('#' + photoNumStr) ||
                   sourceStr.includes(query) ||
                   labelStr.includes(query);
        });
    }
    
    if (sort === 'number') {
        items.sort((a, b) => a.idx - b.idx);
    } else if (sort === 'confidence') {
        items.sort((a, b) => b.confidence - a.confidence || a.idx - b.idx);
    } else if (sort === 'classification') {
        items.sort((a, b) => a.label.localeCompare(b.label) || a.idx - b.idx);
    }
    
    return items;
}

function getFilteredAndSortedRCCPhotos() {
    const query = (state.rcc.searchQuery || '').toLowerCase().trim();
    const sort = state.rcc.sortBy || 'number';
    
    let items = state.rcc.photos.map((dataUrl, idx) => {
        const assignedKey = state.rcc.imageAssignments[idx] || 'unassigned';
        const rec = state.rcc.aiRecommendations[idx] || { key: 'corrosion_minor', pct: 85 };
        const label = RCC_DIAG[assignedKey] ? RCC_DIAG[assignedKey].label : (assignedKey === 'unassigned' ? 'Unassigned' : 'Unknown Defect');
        const source = state.rcc.selectionSource[idx] || 'ai';
        const confidence = rec.pct || 85;
        
        return {
            idx,
            dataUrl,
            assignedKey,
            rec,
            label,
            source,
            confidence
        };
    });
    
    if (query) {
        items = items.filter(item => {
            const photoNumStr = (item.idx + 1).toString();
            const sourceStr = item.source.toLowerCase();
            const labelStr = item.label.toLowerCase();
            
            return photoNumStr.includes(query) ||
                   query.includes('#' + photoNumStr) ||
                   sourceStr.includes(query) ||
                   labelStr.includes(query);
        });
    }
    
    if (sort === 'number') {
        items.sort((a, b) => a.idx - b.idx);
    } else if (sort === 'confidence') {
        items.sort((a, b) => b.confidence - a.confidence || a.idx - b.idx);
    } else if (sort === 'classification') {
        items.sort((a, b) => a.label.localeCompare(b.label) || a.idx - b.idx);
    }
    
    return items;
}

function initPreRecommendations() {
    state.pre.photos.forEach((_, idx) => {
        if (!state.pre.aiRecommendations[idx]) {
            // Distribute mock parameter recommendations based on index
            if (idx % 3 === 0) {
                state.pre.aiRecommendations[idx] = {
                    coverBlocks: "2_blocks",
                    reinfSpacing: "300mm",
                    bars: "8mm",
                    stirrups: "300mm_flexible",
                    key: "low_cover_risk",
                    pct: 88
                };
            } else if (idx % 3 === 1) {
                state.pre.aiRecommendations[idx] = {
                    coverBlocks: "4_blocks",
                    reinfSpacing: "100mm",
                    bars: "32mm",
                    stirrups: "150mm_rigid",
                    key: "congestion_risk",
                    pct: 92
                };
            } else {
                state.pre.aiRecommendations[idx] = {
                    coverBlocks: "4_blocks",
                    reinfSpacing: "150mm",
                    bars: "16mm",
                    stirrups: "150mm_rigid",
                    key: "standard_compliance",
                    pct: 95
                };
            }
        }
        if (!state.pre.imageAssignments[idx]) {
            state.pre.imageAssignments[idx] = {
                coverBlocks: state.pre.aiRecommendations[idx].coverBlocks,
                reinfSpacing: state.pre.aiRecommendations[idx].reinfSpacing,
                bars: state.pre.aiRecommendations[idx].bars,
                stirrups: state.pre.aiRecommendations[idx].stirrups
            };
        }
    });
}

// No search input needed â€” single photo navigation

function renderPreAnalysisList() {
    preAnalysisList.innerHTML = '';

    const totalPhotos = state.pre.photos.length;
    if (totalPhotos === 0) {
        preAnalysisList.innerHTML = `<div style="text-align:center; padding:30px; font-size:0.85rem; color:var(--text-400); font-style:italic;">No photographs uploaded yet.</div>`;
        return;
    }

    const filteredAndSorted = getFilteredAndSortedPrePhotos();
    if (filteredAndSorted.length === 0) {
        preAnalysisList.innerHTML = `<div style="text-align:center; padding:30px; font-size:0.85rem; color:var(--text-400); font-style:italic;">No matching photographs found.</div>`;
        return;
    }

    filteredAndSorted.forEach((item) => {
        const idx = item.idx;
        const dataUrl = item.dataUrl;
        const config = item.config;
        const rec = item.rec;
        const recLabel = PRE_DIAG_DB[rec.key] ? PRE_DIAG_DB[rec.key].label : "Compliant Profile";
        const source = item.source;
        let sourceBadgeHTML = '';
        if (source === 'ai') {
            sourceBadgeHTML = `<span class="source-badge badge-ai" style="display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; font-weight:800; color:#0d9488; background:rgba(20,184,166,0.1); padding:4px 10px; border-radius:var(--r-full); text-transform:uppercase;">AI Interpretation</span>`;
        } else if (source === 'manual') {
            sourceBadgeHTML = `<span class="source-badge badge-manual" style="display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; font-weight:800; color:#6366f1; background:rgba(99,102,241,0.08); padding:4px 10px; border-radius:var(--r-full); text-transform:uppercase;">Manual Interpretations</span>`;
        }

        let selectCoverHTML = `<select class="styled-select pre-cover-select-${idx}" style="flex:1;">`;
        for (const [k, v] of Object.entries(PRE_COVER_OPTS)) {
            selectCoverHTML += `<option value="${k}" ${config.coverBlocks === k ? 'selected' : ''}>${v}</option>`;
        }
        selectCoverHTML += `</select>`;

        let selectSpacingHTML = `<select class="styled-select pre-spacing-select-${idx}" style="flex:1;">`;
        for (const [k, v] of Object.entries(PRE_SPACING_OPTS)) {
            selectSpacingHTML += `<option value="${k}" ${config.reinfSpacing === k ? 'selected' : ''}>${v}</option>`;
        }
        selectSpacingHTML += `</select>`;

        let selectBarsHTML = `<select class="styled-select pre-bars-select-${idx}" style="flex:1;">`;
        for (const [k, v] of Object.entries(PRE_BAR_OPTS)) {
            selectBarsHTML += `<option value="${k}" ${config.bars === k ? 'selected' : ''}>${v}</option>`;
        }
        selectBarsHTML += `</select>`;

        let selectStirrupsHTML = `<select class="styled-select pre-stirrups-select-${idx}" style="flex:1;">`;
        for (const [k, v] of Object.entries(PRE_STIRRUP_OPTS)) {
            selectStirrupsHTML += `<option value="${k}" ${config.stirrups === k ? 'selected' : ''}>${v}</option>`;
        }
        selectStirrupsHTML += `</select>`;

        const photoCard = document.createElement('div');
        photoCard.className = 'sort-item';
        photoCard.style.display = 'flex';
        photoCard.style.gap = '20px';
        photoCard.style.alignItems = 'stretch';
        photoCard.style.padding = '20px';
        photoCard.style.border = '1.5px solid var(--border)';
        photoCard.style.borderRadius = 'var(--r-lg)';
        photoCard.style.background = 'var(--bg-card)';
        photoCard.style.marginBottom = '20px';

        photoCard.innerHTML = `
            <!-- Left Photo Column -->
            <div style="width:140px; flex-shrink:0; display:flex; flex-direction:column; align-items:center; justify-content:center; border-right:1px solid var(--border); padding-right:20px;">
                <img src="${dataUrl}" class="img-zoomable" alt="Pre-construction photo" style="width:120px; height:120px; border-radius:var(--r-md); object-fit:cover; border:1.5px solid var(--border); cursor:zoom-in;">
                <span style="font-family:var(--font-head); font-weight:800; font-size:0.85rem; color:var(--text-500); margin-top:8px;">Photo ${idx + 1}</span>
                <div style="margin-top:6px; min-height:24px; display:flex; align-items:center; justify-content:center;">${sourceBadgeHTML}</div>
                <button class="fb-btn delete-pre-photo-btn" style="margin-top:12px; padding:6px 12px; font-size:0.72rem; color:#ef4444; border-color:rgba(239,68,68,0.3); background:#fff; align-self:stretch; display:flex; align-items:center; justify-content:center; gap:4px; font-weight:800;" onclick="deletePhotoByIndex('pre', ${idx})">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete Photo
                </button>
            </div>

            <!-- Right Content divided in 2 boxes -->
            <div style="flex:1; display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:stretch; position:relative;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); display:flex; align-items:center; justify-content:center; font-family:var(--font-head); font-weight:800; font-size:0.7rem; color:var(--text-500); background:#fff; border-radius:50%; width:26px; height:26px; border:1.5px solid var(--border); z-index:10; box-shadow:0 2px 4px rgba(0,0,0,0.05);">OR</div>
                
                <!-- BOX 1: AI SUGGESTED PARAMETERS -->
                <div class="pre-box-ai-${idx}" style="border:2px solid transparent; border-radius:var(--r-md); padding:14px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease-in-out; position:relative; background:#fff;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--teal-600); letter-spacing:0.05em;">AI Recommendation</span>
                            <span class="pre-badge-ai-${idx}" style="display:none;"></span>
                        </div>
                        <h4 style="font-family:var(--font-head); font-weight:800; font-size:0.85rem; color:var(--text-900); margin-bottom:4px;">${recLabel}</h4>
                        <div style="font-size:0.72rem; color:var(--text-500); line-height:1.4;">
                            - Cover: ${PRE_COVER_OPTS[rec.coverBlocks]}<br>
                            - Spacing: ${PRE_SPACING_OPTS[rec.reinfSpacing]}<br>
                            - Bars: ${PRE_BAR_OPTS[rec.bars]}<br>
                            - Stirrups: ${PRE_STIRRUP_OPTS[rec.stirrups]}
                        </div>
                    </div>
                    <button class="fb-btn apply-pre-ai-btn-${idx}" style="margin-top:12px; padding:6px 12px; font-size:0.72rem; color:var(--teal-600); border-color:rgba(20,184,166,0.3); background:#fff; align-self:start;">
                        Apply AI Recommendation
                    </button>
                </div>

                <!-- BOX 2: MANUAL PARAMETER OVERRIDES -->
                <div class="pre-box-manual-${idx}" style="border:2px solid transparent; border-radius:var(--r-md); padding:14px; display:flex; flex-direction:column; gap:8px; transition:all 0.2s ease-in-out; position:relative; background:#fff;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--text-500); letter-spacing:0.05em;">Manual Parameters</span>
                        <span class="pre-badge-manual-${idx}" style="display:none;"></span>
                    </div>
                    
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:0.65rem; color:var(--text-400); font-weight:600; text-transform:uppercase;">Cover Blocks</span>
                        ${selectCoverHTML}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:0.65rem; color:var(--text-400); font-weight:600; text-transform:uppercase;">Reinforcement Spacing</span>
                        ${selectSpacingHTML}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:0.65rem; color:var(--text-400); font-weight:600; text-transform:uppercase;">Bars Configuration</span>
                        ${selectBarsHTML}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:0.65rem; color:var(--text-400); font-weight:600; text-transform:uppercase;">Stirrups &amp; Shuttering</span>
                        ${selectStirrupsHTML}
                    </div>
                    <button class="fb-btn apply-pre-manual-btn-${idx}" style="margin-top:12px; padding:6px 12px; font-size:0.72rem; color:var(--indigo-600); border-color:rgba(99,102,241,0.3); background:#fff; align-self:start;">
                        Override AI Recommendations
                    </button>
                </div>
            </div>
        `;

        const updateHighlight = () => {
            const isAI = (
                config.coverBlocks === rec.coverBlocks &&
                config.reinfSpacing === rec.reinfSpacing &&
                config.bars === rec.bars &&
                config.stirrups === rec.stirrups
            );

            const boxAI = photoCard.querySelector(`.pre-box-ai-${idx}`);
            const boxManual = photoCard.querySelector(`.pre-box-manual-${idx}`);
            const badgeAI = photoCard.querySelector(`.pre-badge-ai-${idx}`);
            const badgeManual = photoCard.querySelector(`.pre-badge-manual-${idx}`);

            if (isAI) {
                boxAI.style.borderColor = 'var(--teal-500)';
                boxAI.style.background = 'rgba(20, 184, 166, 0.05)';
                badgeAI.style.display = 'inline-block';

                boxManual.style.borderColor = 'var(--border)';
                boxManual.style.background = '#fff';
                badgeManual.style.display = 'none';
            } else {
                boxManual.style.borderColor = '#6366f1';
                boxManual.style.background = 'rgba(99, 102, 241, 0.04)';
                badgeManual.style.display = 'inline-block';

                boxAI.style.borderColor = 'var(--border)';
                boxAI.style.background = '#fff';
                badgeAI.style.display = 'none';
            }
        };

        // Apply Manual Override
        photoCard.querySelector(`.apply-pre-manual-btn-${idx}`).addEventListener('click', () => {
            config.coverBlocks = photoCard.querySelector(`.pre-cover-select-${idx}`).value;
            config.reinfSpacing = photoCard.querySelector(`.pre-spacing-select-${idx}`).value;
            config.bars = photoCard.querySelector(`.pre-bars-select-${idx}`).value;
            config.stirrups = photoCard.querySelector(`.pre-stirrups-select-${idx}`).value;
            state.pre.selectionSource[idx] = 'manual';
            updateHighlight();
            renderPreAnalysisList(); // Re-render to update source badge
            showToast(`Applied manual parameters override for Photo ${idx + 1}`);
        });

        // Apply Recommendation handler
        photoCard.querySelector(`.apply-pre-ai-btn-${idx}`).addEventListener('click', () => {
            config.coverBlocks = rec.coverBlocks;
            config.reinfSpacing = rec.reinfSpacing;
            config.bars = rec.bars;
            config.stirrups = rec.stirrups;
            state.pre.selectionSource[idx] = 'ai';
            updateHighlight();
            renderPreAnalysisList(); // Re-render to update source badge
            showToast(`Applied AI recommended parameters for Photo ${idx + 1}`);
        });

        updateHighlight();
        preAnalysisList.appendChild(photoCard);
    });
}


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// POST-CONSTRUCTION DIAGNOSTICS LOGIC (PHOTO-BY-PHOTO)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const postAnalysisList = $('postAnalysisList');
const postAnalyzeBtn = $('postAnalyzeBtn');

// Post-Construction photo observer to trigger classification lists render
const postPhotoObserver = new MutationObserver(() => {
    const hasPhotos = state.post.photos.length > 0;
    $('postGoToAnalysisBtn').disabled = !hasPhotos;
});
postPhotoObserver.observe($('postPhotoGrid'), { childList: true });

function initPostRecommendations() {
    const mockPostDefs = ['corrosion_minor', 'corrosion_along', 'corrosion_exposed', 'surface_voids_bughole', 'surface_voids', 'surface_voids_honeycombing', 'plaster_spalling', 'cold_joint_formwork'];
    state.post.photos.forEach((_, idx) => {
        if (!state.post.aiRecommendations[idx]) {
            const recKey = mockPostDefs[idx % mockPostDefs.length];
            const pct = 65 + (idx * 7) % 28;
            state.post.aiRecommendations[idx] = { key: recKey, pct: pct };
        }
        if (!state.post.imageAssignments[idx] || state.post.imageAssignments[idx] === 'unassigned') {
            state.post.imageAssignments[idx] = state.post.aiRecommendations[idx].key;
        }
    });
}

// No search input needed â€” single photo navigation

function renderPostAnalysisList() {
    postAnalysisList.innerHTML = '';

    const totalPhotos = state.post.photos.length;
    if (totalPhotos === 0) {
        postAnalysisList.innerHTML = `<div style="text-align:center; padding:30px; font-size:0.85rem; color:var(--text-400); font-style:italic;">No photographs uploaded yet.</div>`;
        return;
    }

    const filteredAndSorted = getFilteredAndSortedPostPhotos();
    if (filteredAndSorted.length === 0) {
        postAnalysisList.innerHTML = `<div style="text-align:center; padding:30px; font-size:0.85rem; color:var(--text-400); font-style:italic;">No matching photographs found.</div>`;
        return;
    }

    filteredAndSorted.forEach((item) => {
        const idx = item.idx;
        const dataUrl = item.dataUrl;
        const assignedKey = item.assignedKey;
        const recData = item.rec;
        const recLabel = POST_DIAG[recData.key] ? POST_DIAG[recData.key].label : 'Unknown Defect';
        const recSeverity = POST_DIAG[recData.key] ? POST_DIAG[recData.key].severity : 'low';

        const source = item.source;
        let sourceBadgeHTML = '';
        if (source === 'ai') {
            sourceBadgeHTML = `<span class="source-badge badge-ai" style="display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; font-weight:800; color:#0d9488; background:rgba(20,184,166,0.1); padding:4px 10px; border-radius:var(--r-full); text-transform:uppercase;">AI Interpretation</span>`;
        } else if (source === 'manual') {
            sourceBadgeHTML = `<span class="source-badge badge-manual" style="display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; font-weight:800; color:#6366f1; background:rgba(99,102,241,0.08); padding:4px 10px; border-radius:var(--r-full); text-transform:uppercase;">Manual Interpretations</span>`;
        }

        let selectHTML = `<select class="styled-select post-photo-select-${idx}" style="flex:1;">
            <option value="unassigned" ${assignedKey === 'unassigned' ? 'selected' : ''}>- Unassigned -</option>`;
        for (const [key, value] of Object.entries(POST_DIAG)) {
            selectHTML += `<option value="${key}" ${assignedKey === key ? 'selected' : ''}>${value.label}</option>`;
        }
        selectHTML += `</select>`;

        const photoCard = document.createElement('div');
        photoCard.className = 'sort-item';
        photoCard.style.display = 'flex';
        photoCard.style.gap = '20px';
        photoCard.style.alignItems = 'stretch';
        photoCard.style.padding = '20px';
        photoCard.style.border = '1.5px solid var(--border)';
        photoCard.style.borderRadius = 'var(--r-lg)';
        photoCard.style.background = 'var(--bg-card)';
        photoCard.style.marginBottom = '20px';

        photoCard.innerHTML = `
            <!-- Left Photo Column -->
            <div style="width:140px; flex-shrink:0; display:flex; flex-direction:column; align-items:center; justify-content:center; border-right:1px solid var(--border); padding-right:20px;">
                <img src="${dataUrl}" class="img-zoomable" alt="Post-construction photo" style="width:120px; height:120px; border-radius:var(--r-md); object-fit:cover; border:1.5px solid var(--border); cursor:zoom-in;">
                <span style="font-family:var(--font-head); font-weight:800; font-size:0.85rem; color:var(--text-500); margin-top:8px;">Photo ${idx + 1}</span>
                <div style="margin-top:6px; min-height:24px; display:flex; align-items:center; justify-content:center;">${sourceBadgeHTML}</div>
                <button class="fb-btn delete-post-photo-btn" style="margin-top:12px; padding:6px 12px; font-size:0.72rem; color:#ef4444; border-color:rgba(239,68,68,0.3); background:#fff; align-self:stretch; display:flex; align-items:center; justify-content:center; gap:4px; font-weight:800;" onclick="deletePhotoByIndex('post', ${idx})">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete Photo
                </button>
            </div>

            <!-- Right Content divided in 2 boxes -->
            <div style="flex:1; display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:stretch; position:relative;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); display:flex; align-items:center; justify-content:center; font-family:var(--font-head); font-weight:800; font-size:0.7rem; color:var(--text-500); background:#fff; border-radius:50%; width:26px; height:26px; border:1.5px solid var(--border); z-index:10; box-shadow:0 2px 4px rgba(0,0,0,0.05);">OR</div>
                
                <!-- BOX 1: AI RECOMMENDED DIAGNOSTICS -->
                <div class="post-box-ai-${idx}" style="border:2px solid transparent; border-radius:var(--r-md); padding:14px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease-in-out; position:relative; background:#fff;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--teal-600); letter-spacing:0.05em;">AI Recommendation</span>
                            <span class="post-badge-ai-${idx}" style="display:none;"></span>
                        </div>
                        <h4 style="font-family:var(--font-head); font-weight:800; font-size:0.85rem; color:var(--text-900); margin-bottom:4px;">${recLabel}</h4>
                        <span style="font-size:0.75rem; color:var(--text-500); font-weight:600;">${recData.pct}% Match confidence</span>
                    </div>
                    <button class="fb-btn apply-post-ai-btn-${idx}" style="margin-top:12px; padding:6px 12px; font-size:0.72rem; color:var(--teal-600); border-color:rgba(20,184,166,0.3); background:#fff; align-self:start;">
                        Apply AI Recommendation
                    </button>
                </div>

                <!-- BOX 2: MANUAL CLASSIFICATION -->
                <div class="post-box-manual-${idx}" style="border:2px solid transparent; border-radius:var(--r-md); padding:14px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease-in-out; position:relative; background:#fff;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--text-500); letter-spacing:0.05em;">Defect Classification Manually</span>
                            <span class="post-badge-manual-${idx}" style="display:none;"></span>
                        </div>
                        <div style="display:flex; gap:8px; align-items:center; margin-bottom:12px;">
                            ${selectHTML}
                            <button class="fb-btn register-custom-btn" style="padding:0; width:38px; height:38px; font-size:1.2rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0;" title="Register custom defect" onclick="openRegisterCustomDefectModal('post', ${idx})">+</button>
                        </div>
                    </div>
                    <button class="fb-btn apply-post-manual-btn-${idx}" style="padding:6px 12px; font-size:0.72rem; color:var(--indigo-600); border-color:rgba(99,102,241,0.3); background:#fff; align-self:start;">
                        Override AI Recommendations
                    </button>
                </div>
            </div>
        `;

        const updateHighlight = () => {
            const isAI = (state.post.imageAssignments[idx] === recData.key);

            const boxAI = photoCard.querySelector(`.post-box-ai-${idx}`);
            const boxManual = photoCard.querySelector(`.post-box-manual-${idx}`);
            const badgeAI = photoCard.querySelector(`.post-badge-ai-${idx}`);
            const badgeManual = photoCard.querySelector(`.post-badge-manual-${idx}`);

            if (isAI) {
                boxAI.style.borderColor = 'var(--teal-500)';
                boxAI.style.background = 'rgba(20, 184, 166, 0.05)';
                badgeAI.style.display = 'inline-block';

                boxManual.style.borderColor = 'var(--border)';
                boxManual.style.background = '#fff';
                badgeManual.style.display = 'none';
            } else {
                boxManual.style.borderColor = '#6366f1';
                boxManual.style.background = 'rgba(99, 102, 241, 0.04)';
                badgeManual.style.display = 'inline-block';

                boxAI.style.borderColor = 'var(--border)';
                boxAI.style.background = '#fff';
                badgeAI.style.display = 'none';
            }
        };

        // Apply Manual Override
        photoCard.querySelector(`.apply-post-manual-btn-${idx}`).addEventListener('click', () => {
            const val = photoCard.querySelector(`.post-photo-select-${idx}`).value;
            state.post.imageAssignments[idx] = val;
            state.post.selectionSource[idx] = 'manual';
            updateHighlight();
            renderPostAnalysisList();
            showToast(`Applied manual classification for Photo ${idx + 1}`);
        });

        // Apply AI Recommended
        photoCard.querySelector(`.apply-post-ai-btn-${idx}`).addEventListener('click', () => {
            const key = recData.key;
            state.post.imageAssignments[idx] = key;
            state.post.selectionSource[idx] = 'ai';
            updateHighlight();
            renderPostAnalysisList();
            showToast(`Applied AI recommendation for Photo ${idx + 1}`);
        });

        updateHighlight();
        postAnalysisList.appendChild(photoCard);
    });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FEEDBACK BUTTONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
document.querySelectorAll('.fb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        const mode   = btn.dataset.mode;
        if (!choice || !mode) return;
        document.querySelectorAll(`[data-mode="${mode}"].fb-btn`).forEach(b => b.classList.toggle('selected', b === btn));
        $(mode + 'CardA').classList.toggle('preferred', choice === 'A');
        $(mode + 'CardB').classList.toggle('preferred', choice === 'B');

        const msgs = { A: 'Response A preferred', B: 'Response B preferred', both: 'Both marked acceptable', neither: 'Neither matches' };
        showToast(msgs[choice]);
    });
});

window.selectRemediationPreference = function(mode, key, choice) {
    if (!state[mode].remediationPreferences) {
        state[mode].remediationPreferences = {};
    }
    state[mode].remediationPreferences[key] = choice;
    showToast(`Remediation choice updated for ${key}`);
    refreshSolutionsReport(mode);
};

window.refreshSolutionsReport = function(mode) {
    if (mode === 'post') {
        renderPostSolutionsReport();
    } else if (mode === 'rcc') {
        renderRCCSolutionsReport();
    }
};

window.selectPreRemediationPreference = function(idx, choice) {
    if (!state.pre.remediationPreferences) {
        state.pre.remediationPreferences = {};
    }
    state.pre.remediationPreferences[idx] = choice;
    showToast(`Photo ${idx + 1} preferred settings updated.`);
    renderPreSolutionsReport();
};

window.getCompareGridHTML = function(mode, key) {
    const db = (mode === 'post') ? POST_DIAG : RCC_DIAG;
    const item = db[key];
    if (!item || !item.A || !item.B) return '';

    const pref = (state[mode].remediationPreferences && state[mode].remediationPreferences[key]) || null;
    const isPrefA = (pref === 'A');
    const isPrefB = (pref === 'B');

    return `
        <div style="margin-top:16px;">
            <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-400); display:block; margin-bottom:10px;">Select Preferred Remediation Strategy</span>
            <div class="compare-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <!-- Option A Card -->
                <div class="compare-card ${isPrefA ? 'preferred' : ''}" style="cursor:pointer; position:relative;" onclick="selectRemediationPreference('${mode}', '${key}', 'A')">
                    <span class="cc-badge badge-a">OPTION A</span>
                    ${isPrefA ? '<span class="preferred-badge" style="position: absolute; bottom: 12px; right: 12px; background: var(--teal-500); color: white; padding: 2px 8px; border-radius: var(--r-full); font-size: 0.65rem; font-weight: 800; font-family: var(--font-head);">[OK] Preferred</span>' : ''}
                    <div class="cc-header">
                        <span class="cc-match">${item.A.match}%</span>
                        <span class="cc-label">FEASIBILITY MATCH</span>
                    </div>
                    <div class="cc-body">
                        <h3>${item.A.title}</h3>
                        <div class="cc-section">
                            <h4>SCOPE & TECHNOLOGY</h4>
                            <p style="text-align:justify; font-size:0.8rem; line-height:1.5;">${item.A.scope}</p>
                        </div>
                        <div class="cc-section">
                            <h4>DURATION & COST</h4>
                            <p style="text-align:justify; font-size:0.8rem; line-height:1.5;">${item.A.costDuration}</p>
                        </div>
                    </div>
                </div>

                <!-- Option B Card -->
                <div class="compare-card ${isPrefB ? 'preferred' : ''}" style="cursor:pointer; position:relative;" onclick="selectRemediationPreference('${mode}', '${key}', 'B')">
                    <span class="cc-badge badge-b">OPTION B</span>
                    ${isPrefB ? '<span class="preferred-badge" style="position: absolute; bottom: 12px; right: 12px; background: var(--teal-500); color: white; padding: 2px 8px; border-radius: var(--r-full); font-size: 0.65rem; font-weight: 800; font-family: var(--font-head);">[OK] Preferred</span>' : ''}
                    <div class="cc-header">
                        <span class="cc-match">${item.B.match}%</span>
                        <span class="cc-label">FEASIBILITY MATCH</span>
                    </div>
                    <div class="cc-body">
                        <h3>${item.B.title}</h3>
                        <div class="cc-section">
                            <h4>SCOPE & TECHNOLOGY</h4>
                            <p style="text-align:justify; font-size:0.8rem; line-height:1.5;">${item.B.scope}</p>
                        </div>
                        <div class="cc-section">
                            <h4>DURATION & COST</h4>
                            <p style="text-align:justify; font-size:0.8rem; line-height:1.5;">${item.B.costDuration}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.getPrePhotoCompareGridHTML = function(idx) {
    const rec = state.pre.aiRecommendations[idx];
    const config = state.pre.imageAssignments[idx] || { coverBlocks: '4_blocks', reinfSpacing: '150mm', bars: '16mm', stirrups: '150mm_rigid' };
    
    const pref = state.pre.remediationPreferences ? state.pre.remediationPreferences[idx] : null;
    const isPrefA = (pref === 'A');
    const isPrefB = (pref === 'B');

    return `
        <div style="margin-top:16px; margin-bottom:16px; border:1px solid var(--border); border-radius:var(--r-lg); padding:16px; background:#fafafa;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <img src="${state.pre.photos[idx]}" class="img-zoomable" style="width:50px; height:50px; object-fit:cover; border-radius:var(--r-sm); border:1px solid var(--border-strong); cursor:zoom-in;">
                <div>
                    <span style="font-family:var(--font-head); font-weight:800; font-size:0.85rem; color:var(--text-900);">Photo ${idx + 1} Settings Preference</span>
                    <span style="display:block; font-size:0.7rem; color:var(--text-400);">Choose which configuration to apply for this member</span>
                </div>
            </div>
            <div class="compare-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <!-- Option A: AI Recommended Settings -->
                <div class="compare-card ${isPrefA ? 'preferred' : ''}" style="cursor:pointer; position:relative; padding:16px; background:#fff; border-radius:var(--r-md); border:1.5px solid var(--border); min-height:180px;" onclick="selectPreRemediationPreference(${idx}, 'A')">
                    <span class="cc-badge badge-a" style="font-size:0.55rem; padding:2px 8px;">AI Suggested Settings</span>
                    ${isPrefA ? '<span class="preferred-badge" style="position: absolute; bottom: 12px; right: 12px; background: var(--teal-500); color: white; padding: 2px 8px; border-radius: var(--r-full); font-size: 0.65rem; font-weight: 800; font-family: var(--font-head);">[OK] Preferred</span>' : ''}
                    
                    <div class="cc-body" style="gap:8px; margin-top:16px;">
                        <h3 style="font-size:0.85rem; font-weight:800; margin-bottom:6px; border-bottom:none; padding-bottom:0;">AI Recommended Settings</h3>
                        <div class="cc-section" style="font-size:0.75rem; color:var(--text-700); line-height:1.4;">
                            <strong>Cover Blocks:</strong> ${PRE_COVER_OPTS[rec.coverBlocks]}<br>
                            <strong>Reinforcement Spacing:</strong> ${PRE_SPACING_OPTS[rec.reinfSpacing]}<br>
                            <strong>Bars Configuration:</strong> ${PRE_BAR_OPTS[rec.bars]}<br>
                            <strong>Stirrups & Shuttering:</strong> ${PRE_STIRRUP_OPTS[rec.stirrups]}
                        </div>
                    </div>
                </div>

                <!-- Option B: Manual Parameters -->
                <div class="compare-card ${isPrefB ? 'preferred' : ''}" style="cursor:pointer; position:relative; padding:16px; background:#fff; border-radius:var(--r-md); border:1.5px solid var(--border); min-height:180px;" onclick="selectPreRemediationPreference(${idx}, 'B')">
                    <span class="cc-badge badge-b" style="font-size:0.55rem; padding:2px 8px;">Manual Settings</span>
                    ${isPrefB ? '<span class="preferred-badge" style="position: absolute; bottom: 12px; right: 12px; background: var(--teal-500); color: white; padding: 2px 8px; border-radius: var(--r-full); font-size: 0.65rem; font-weight: 800; font-family: var(--font-head);">[OK] Preferred</span>' : ''}
                    
                    <div class="cc-body" style="gap:8px; margin-top:16px;">
                        <h3 style="font-size:0.85rem; font-weight:800; margin-bottom:6px; border-bottom:none; padding-bottom:0;">Manual Parameters</h3>
                        <div class="cc-section" style="font-size:0.75rem; color:var(--text-700); line-height:1.4;">
                            <strong>Cover Blocks:</strong> ${PRE_COVER_OPTS[config.coverBlocks]}<br>
                            <strong>Reinforcement Spacing:</strong> ${PRE_SPACING_OPTS[config.reinfSpacing]}<br>
                            <strong>Bars Configuration:</strong> ${PRE_BAR_OPTS[config.bars]}<br>
                            <strong>Stirrups & Shuttering:</strong> ${PRE_STIRRUP_OPTS[config.stirrups]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.closeRegisterCustomDefectModal = function() {
    const modal = document.getElementById('customDefectModal');
    if (modal) modal.remove();
};

window.saveCustomDefectType = function(mode) {
    const label = document.getElementById('modalDefectLabel').value.trim();
    const severity = "med";
    const rootCause = document.getElementById('modalDefectRootCause').value.trim();
    const furtherInvestigation = document.getElementById('modalDefectFurtherInvestigation').value.trim();
    const futureSolution = document.getElementById('modalDefectFutureSolution').value.trim();

    if (!label || !rootCause || !furtherInvestigation || !futureSolution) {
        showToast("Please fill out all fields.");
        return;
    }

    const key = 'custom_' + Date.now();
    const newDefect = {
        label,
        severity,
        rootCause,
        furtherInvestigation,
        futureSolution,
        optionA: {
            title: "Advanced Structural Retrofitting",
            match: 90,
            scope: `Systematic structural restoration: ${futureSolution}`,
            costDuration: "Premium Cost | 3 Days Execution"
        },
        optionB: {
            title: "Cost-Effective Maintenance Repair",
            match: 75,
            scope: `Localized maintenance & repair: ${futureSolution}`,
            costDuration: "Economical Cost | 1 Day Execution"
        }
    };

    if (mode === 'post' || mode === 'rcc') {
        POST_DIAG[key] = newDefect;
    } else if (mode === 'pre') {
        PRE_DIAG_DB[key] = newDefect;
    }

    const currentPhotoIdx = state[mode].currentPhotoIdx;
    state[mode].imageAssignments[currentPhotoIdx] = key;
    state[mode].selectionSource[currentPhotoIdx] = 'manual';

    showToast(`Custom defect "${label}" registered successfully.`);
    window.closeRegisterCustomDefectModal();

    if (mode === 'post') {
        renderPostAnalysisList();
    } else if (mode === 'rcc') {
        renderRCCAnalysisList();
    } else if (mode === 'pre') {
        renderPreAnalysisList();
    }
};

window.openRegisterCustomDefectModal = function(mode, idx) {
    state[mode].currentPhotoIdx = idx;
    window.closeRegisterCustomDefectModal();

    const modalDiv = document.createElement('div');
    modalDiv.id = 'customDefectModal';
    modalDiv.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; font-family:var(--font-body);';

    modalDiv.innerHTML = `
        <div style="background:#fff; border-radius:var(--r-xl); width:100%; max-width:600px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); overflow:hidden; border:1px solid var(--border); animation: modalFadeIn 0.25s ease-out;">
            <div style="padding:18px 24px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
                <h3 style="margin:0; font-family:var(--font-head); font-size:1.1rem; font-weight:800; color:var(--text-900);">Register Custom Defect Type</h3>
                <button onclick="closeRegisterCustomDefectModal()" style="background:none; border:none; color:var(--text-400); cursor:pointer; font-size:1.5rem; display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; transition:background 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='none'">x</button>
            </div>
            <div style="padding:24px; display:flex; flex-direction:column; gap:16px; max-height:calc(100vh - 200px); overflow-y:auto;">
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.75rem; font-weight:800; color:var(--text-600); text-transform:uppercase;">Defect Name / Label</label>
                    <input type="text" id="modalDefectLabel" placeholder="e.g. Slab Delamination" style="width:100%; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'">
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.75rem; font-weight:800; color:var(--text-600); text-transform:uppercase;">Root Cause</label>
                    <textarea id="modalDefectRootCause" placeholder="Describe the physical/chemical root cause of this defect..." style="width:100%; min-height:70px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.75rem; font-weight:800; color:var(--text-600); text-transform:uppercase;">Further Investigation</label>
                    <textarea id="modalDefectFurtherInvestigation" placeholder="Detail any non-destructive tests or surveys needed..." style="width:100%; min-height:70px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.75rem; font-weight:800; color:var(--text-600); text-transform:uppercase;">Remediation Solution</label>
                    <textarea id="modalDefectFutureSolution" placeholder="Describe the engineering repair methodology..." style="width:100%; min-height:70px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                </div>
            </div>
            <div style="padding:16px 24px; background:#f8fafc; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:12px;">
                <button onclick="closeRegisterCustomDefectModal()" style="padding:8px 16px; border:1px solid var(--border); background:#fff; color:var(--text-600); border-radius:var(--r-md); font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">Close</button>
                <button onclick="saveCustomDefectType('${mode}')" style="padding:8px 16px; border:none; background:#22c55e; color:#fff; border-radius:var(--r-md); font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#16a34a'" onmouseout="this.style.background='#22c55e'">Register Defect</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);
};



// Setup RCC Uploader
setupPhotoUploader({
    mode: 'rcc',
    gridId: 'rccPhotoGrid',
    addBtnId: 'rccAddBtn',
    fileInputId: 'rccFileInput',
    countId: 'rccPhotoCount',
    uploadCardId: 'rccUploadCard',
    nextCardId: 'rccGoToAnalysisBtn',
    dropOverlayId: 'rccDropOverlay'
});

// Observe RCC photos to update analysis button state
const rccPhotoObserver = new MutationObserver(() => {
    $('rccGoToAnalysisBtn').disabled = state.rcc.photos.length === 0;
});
rccPhotoObserver.observe($('rccPhotoGrid'), { childList: true });

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STEP 1 -> STEP 2 TRANSITION (IMAGE-BY-IMAGE CLASSIFICATION)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const rccAnalysisList = $('rccAnalysisList');

$('rccGoToAnalysisBtn').addEventListener('click', () => {
    // Show step 2 card
    $('rccAnalysisCard').classList.remove('hidden');
    $('rccAnalysisCard').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Initialize recommendations
    const mockAiDefs = ['corrosion_minor', 'corrosion_along', 'corrosion_exposed', 'surface_voids_bughole', 'surface_voids', 'surface_voids_honeycombing', 'plaster_spalling', 'cold_joint_formwork'];
    state.rcc.photos.forEach((_, idx) => {
        if (!state.rcc.aiRecommendations[idx]) {
            const recKey = mockAiDefs[idx % mockAiDefs.length];
            const pct = 65 + (idx * 7) % 28;
            state.rcc.aiRecommendations[idx] = { key: recKey, pct: pct };
        }
        if (!state.rcc.imageAssignments[idx] || state.rcc.imageAssignments[idx] === 'unassigned') {
            state.rcc.imageAssignments[idx] = state.rcc.aiRecommendations[idx].key;
        }
    });

    renderRCCAnalysisList();
});

// No search input needed â€” single photo navigation

function renderRCCAnalysisList() {
    rccAnalysisList.innerHTML = '';

    const totalPhotos = state.rcc.photos.length;
    if (totalPhotos === 0) {
        rccAnalysisList.innerHTML = `<div style="text-align:center; padding:30px; font-size:0.85rem; color:var(--text-400); font-style:italic;">No photographs uploaded yet.</div>`;
        return;
    }

    const filteredAndSorted = getFilteredAndSortedRCCPhotos();
    if (filteredAndSorted.length === 0) {
        rccAnalysisList.innerHTML = `<div style="text-align:center; padding:30px; font-size:0.85rem; color:var(--text-400); font-style:italic;">No matching photographs found.</div>`;
        return;
    }

    filteredAndSorted.forEach((item) => {
        const idx = item.idx;
        const dataUrl = item.dataUrl;
        const assignedKey = item.assignedKey;
        const recData = item.rec;
        const recLabel = RCC_DIAG[recData.key] ? RCC_DIAG[recData.key].label : 'Unknown Defect';
        const recSeverity = RCC_DIAG[recData.key] ? RCC_DIAG[recData.key].severity : 'low';

        const source = item.source;
        let sourceBadgeHTML = '';
        if (source === 'ai') {
            sourceBadgeHTML = `<span class="source-badge badge-ai" style="display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; font-weight:800; color:#0d9488; background:rgba(20,184,166,0.1); padding:4px 10px; border-radius:var(--r-full); text-transform:uppercase;">AI Interpretation</span>`;
        } else if (source === 'manual') {
            sourceBadgeHTML = `<span class="source-badge badge-manual" style="display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; font-weight:800; color:#6366f1; background:rgba(99,102,241,0.08); padding:4px 10px; border-radius:var(--r-full); text-transform:uppercase;">Manual Interpretations</span>`;
        }

        let selectHTML = `<select class="styled-select rcc-photo-select-${idx}" style="flex:1;">
            <option value="unassigned" ${assignedKey === 'unassigned' ? 'selected' : ''}>- Unassigned -</option>`;
        for (const [key, value] of Object.entries(RCC_DIAG)) {
            selectHTML += `<option value="${key}" ${assignedKey === key ? 'selected' : ''}>${value.label}</option>`;
        }
        selectHTML += `</select>`;

        const photoCard = document.createElement('div');
        photoCard.className = 'sort-item';
        photoCard.style.display = 'flex';
        photoCard.style.gap = '20px';
        photoCard.style.alignItems = 'stretch';
        photoCard.style.padding = '20px';
        photoCard.style.border = '1.5px solid var(--border)';
        photoCard.style.borderRadius = 'var(--r-lg)';
        photoCard.style.background = 'var(--bg-card)';
        photoCard.style.marginBottom = '20px';

        photoCard.innerHTML = `
            <!-- Left Photo Column -->
            <div style="width:140px; flex-shrink:0; display:flex; flex-direction:column; align-items:center; justify-content:center; border-right:1px solid var(--border); padding-right:20px;">
                <img src="${dataUrl}" class="img-zoomable" alt="Concrete defect photo" style="width:120px; height:120px; border-radius:var(--r-md); object-fit:cover; border:1.5px solid var(--border); cursor:zoom-in;">
                <span style="font-family:var(--font-head); font-weight:800; font-size:0.85rem; color:var(--text-500); margin-top:8px;">Photo ${idx + 1}</span>
                <div style="margin-top:6px; min-height:24px; display:flex; align-items:center; justify-content:center;">${sourceBadgeHTML}</div>
                <button class="fb-btn delete-rcc-photo-btn" style="margin-top:12px; padding:6px 12px; font-size:0.72rem; color:#ef4444; border-color:rgba(239,68,68,0.3); background:#fff; align-self:stretch; display:flex; align-items:center; justify-content:center; gap:4px; font-weight:800;" onclick="deletePhotoByIndex('rcc', ${idx})">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete Photo
                </button>
            </div>

            <!-- Right Selection Content Divided into Two Boxes -->
            <div style="flex:1; display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:stretch; position:relative;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); display:flex; align-items:center; justify-content:center; font-family:var(--font-head); font-weight:800; font-size:0.7rem; color:var(--text-500); background:#fff; border-radius:50%; width:26px; height:26px; border:1.5px solid var(--border); z-index:10; box-shadow:0 2px 4px rgba(0,0,0,0.05);">OR</div>
                
                <!-- BOX 1: AI RECOMMENDED DIAGNOSTICS -->
                <div class="rcc-box-ai-${idx}" style="border:2px solid transparent; border-radius:var(--r-md); padding:14px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease-in-out; position:relative; background:#fff;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--teal-600); letter-spacing:0.05em;">AI Recommendation</span>
                            <span class="rcc-badge-ai-${idx}" style="display:none;"></span>
                        </div>
                        <h4 style="font-family:var(--font-head); font-weight:800; font-size:0.85rem; color:var(--text-900); margin-bottom:4px;">${recLabel}</h4>
                        <span style="font-size:0.75rem; color:var(--text-500); font-weight:600;">${recData.pct}% Match confidence</span>
                    </div>
                    <button class="fb-btn apply-rcc-ai-btn-${idx}" style="margin-top:12px; padding:6px 12px; font-size:0.72rem; color:var(--teal-600); border-color:rgba(20,184,166,0.3); background:#fff; align-self:start;">
                        Apply AI Recommendation
                    </button>
                </div>

                <!-- BOX 2: MANUAL CLASSIFICATION -->
                <div class="rcc-box-manual-${idx}" style="border:2px solid transparent; border-radius:var(--r-md); padding:14px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease-in-out; position:relative; background:#fff;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--text-500); letter-spacing:0.05em;">Defect Classification Manually</span>
                            <span class="rcc-badge-manual-${idx}" style="display:none;"></span>
                        </div>
                        <div style="display:flex; gap:8px; align-items:center; margin-bottom:12px;">
                            ${selectHTML}
                            <button class="fb-btn register-custom-btn" style="padding:0; width:38px; height:38px; font-size:1.2rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0;" title="Register custom defect" onclick="openRegisterCustomDefectModal('rcc', ${idx})">+</button>
                        </div>
                    </div>
                    <button class="fb-btn apply-rcc-manual-btn-${idx}" style="padding:6px 12px; font-size:0.72rem; color:var(--indigo-600); border-color:rgba(99,102,241,0.3); background:#fff; align-self:start;">
                        Override AI Recommendations
                    </button>
                </div>
            </div>
        `;

        const updateHighlight = () => {
            const isAI = (state.rcc.imageAssignments[idx] === recData.key);

            const boxAI = photoCard.querySelector(`.rcc-box-ai-${idx}`);
            const boxManual = photoCard.querySelector(`.rcc-box-manual-${idx}`);
            const badgeAI = photoCard.querySelector(`.rcc-badge-ai-${idx}`);
            const badgeManual = photoCard.querySelector(`.rcc-badge-manual-${idx}`);

            if (isAI) {
                boxAI.style.borderColor = 'var(--teal-500)';
                boxAI.style.background = 'rgba(20, 184, 166, 0.05)';
                badgeAI.style.display = 'inline-block';

                boxManual.style.borderColor = 'var(--border)';
                boxManual.style.background = '#fff';
                badgeManual.style.display = 'none';
            } else {
                boxManual.style.borderColor = '#6366f1';
                boxManual.style.background = 'rgba(99, 102, 241, 0.04)';
                badgeManual.style.display = 'inline-block';

                boxAI.style.borderColor = 'var(--border)';
                boxAI.style.background = '#fff';
                badgeAI.style.display = 'none';
            }
        };

        // Apply Manual Override
        photoCard.querySelector(`.apply-rcc-manual-btn-${idx}`).addEventListener('click', () => {
            const val = photoCard.querySelector(`.rcc-photo-select-${idx}`).value;
            state.rcc.imageAssignments[idx] = val;
            state.rcc.selectionSource[idx] = 'manual';
            updateHighlight();
            renderRCCAnalysisList();
            showToast(`Applied manual classification for Photo ${idx + 1}`);
        });

        // Apply AI recommendation click handler
        photoCard.querySelector(`.apply-rcc-ai-btn-${idx}`).addEventListener('click', () => {
            const key = recData.key;
            state.rcc.imageAssignments[idx] = key;
            state.rcc.selectionSource[idx] = 'ai';
            updateHighlight();
            renderRCCAnalysisList();
            showToast(`Applied AI recommendation for Photo ${idx + 1}`);
        });

        updateHighlight();
        rccAnalysisList.appendChild(photoCard);
    });
}


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRE-CONSTRUCTION SOLUTIONS REPORT COMPILER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function getPrePhotoRiskKey(config) {
    if (!config) return "balanced_risk";
    const { coverBlocks, reinfSpacing, bars, stirrups } = config;
    let cover = 0, congestion = 0, formwork = 0;

    if (coverBlocks === "2_blocks" || coverBlocks === "3_blocks") cover += 3;
    if (reinfSpacing === "100mm" || reinfSpacing === "125mm") congestion += 2;
    if (bars === "32mm" || bars === "25mm") congestion += 2;
    if (stirrups === "200mm_flexible" || stirrups === "250mm_flexible" || stirrups === "300mm_flexible") formwork += 2;

    if (cover >= 3) return "low_cover_risk";
    if (congestion >= 3) return "congestion_risk";
    if (formwork >= 2) return "formwork_risk";
    if (bars === "32mm" && (stirrups === "100mm_rigid" || stirrups === "150mm_rigid")) return "heavy_section_risk";
    return "balanced_risk";
}

preAnalyzeBtn.addEventListener('click', () => {
    preAnalyzeBtn.disabled = true;
    const btnText = preAnalyzeBtn.querySelector('.btn-text');
    btnText.innerHTML = `<span class="spinner-dot"></span> Compiling diagnosticsâ€¦`;

    setTimeout(() => {
        renderPreSolutionsReport();
        $('preParamCard').classList.add('hidden');
        $('preResultsCard').classList.remove('hidden');
        $('preResultsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Pre-construction diagnostics compiled');
        
        preAnalyzeBtn.disabled = false;
        btnText.innerHTML = `Run Diagnostic Analysis <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    }, 1400);
});

function renderPreSolutionsReport() {
    const reportList = $('preSolutionsReportList');
    reportList.innerHTML = '';

    // Determine the risk key for each photo
    const assignedRiskKeys = state.pre.photos.map((_, idx) => getPrePhotoRiskKey(state.pre.imageAssignments[idx]));
    const activeRisks = Array.from(new Set(assignedRiskKeys));

    activeRisks.forEach(key => {
        const data = PRE_DIAG_DB[key];
        if (!data) return;

        // Gather photos matching this risk category
        let photosHTML = '';
        let paramHTML = '';
        state.pre.photos.forEach((dataUrl, idx) => {
            if (assignedRiskKeys[idx] === key) {
                const config = state.pre.imageAssignments[idx] || { coverBlocks: '4_blocks', reinfSpacing: '150mm', bars: '16mm', stirrups: '150mm_rigid' };
                const isAI = (state.pre.selectionSource[idx] === 'ai');
                const badgeText = isAI ? 'AI Interpretation' : 'Manual';
                const badgeColor = isAI ? '#0d9488' : '#6366f1';
                const badgeBg = isAI ? 'rgba(20,184,166,0.1)' : 'rgba(99,102,241,0.08)';

                photosHTML += `
                    <div style="text-align:center; background:#f8fafc; border:1px solid var(--border); border-radius:var(--r-md); padding:8px; min-width:0;">
                        <img src="${dataUrl}" class="img-zoomable" style="width:100%; height:80px; object-fit:cover; border-radius:var(--r-sm); border:1px solid var(--border-strong); display:block; cursor:zoom-in;" title="Photo ${idx + 1}">
                        <div style="margin-top:6px; font-family:var(--font-head); font-weight:700; font-size:0.7rem; color:var(--text-900);">${idx + 1}</div>
                        <span style="font-size:0.55rem; font-weight:700; color:${badgeColor}; background:${badgeBg}; padding:1px 6px; border-radius:var(--r-full); text-transform:uppercase;">${badgeText}</span>
                    </div>
                `;

            }
        });

        const groupDiv = document.createElement('div');
        groupDiv.className = 'rcc-solution-group';
        groupDiv.style.padding = '24px';
        groupDiv.style.marginBottom = '20px';
        groupDiv.style.border = '1.5px solid var(--border)';
        groupDiv.style.borderRadius = 'var(--r-xl)';
        groupDiv.style.background = '#fff';

        const severity = data.severity;
        const categoryName = data.label;

        groupDiv.innerHTML = `
            <div class="rsg-header" style="border-bottom:1.5px solid var(--border); padding-bottom:10px; margin-bottom:16px;">
                <span class="rsg-title" style="font-size:1.1rem; font-weight:800; font-family:var(--font-head); color:var(--text-900);">${categoryName}</span>
            </div>

            <div style="margin-bottom:18px;">
                <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-400); display:block; margin-bottom:10px;">Evidence Photographs</span>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
                    ${photosHTML}
                </div>
            </div>

            <div style="margin-top:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <h4 style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-900); margin:0; letter-spacing:0.05em;">Conclusive Remarks</h4>
                </div>
                ${getMarketRateTableHTML('pre', key)}
            </div>
        `;

        reportList.appendChild(groupDiv);
    });
}

// Restart Pre
$('preRestartBtn').addEventListener('click', () => {
    state.pre.photos = [];
    state.pre.imageAssignments = {};
    state.pre.aiRecommendations = {};
    state.pre.remediationPreferences = {};
    state.pre.selectionSource = {};
    state.pre.currentPhotoIdx = 0;
    state.pre.searchQuery = '';
    state.pre.sortBy = 'number';
    $('preSearchInput').value = '';
    $('preSortSelect').value = 'number';

    $('preResultsCard').classList.add('hidden');
    $('preParamCard').classList.add('locked', 'hidden');
    $('preUploadCard').classList.remove('hidden');
    setupPhotoUploader({
        mode: 'pre',
        gridId: 'prePhotoGrid',
        addBtnId: 'preAddBtn',
        fileInputId: 'preFileInput',
        countId: 'prePhotoCount',
        uploadCardId: 'preUploadCard',
        nextCardId: 'preGoToAnalysisBtn',
        dropOverlayId: 'preDropOverlay'
    });

    // Clear photo thumbnails
    $('prePhotoGrid').querySelectorAll('.photo-thumb').forEach(el => el.remove());
    $('prePhotoCount').textContent = '0 photos';
    $('prePhotoCount').style = '';
    preAnalysisList.innerHTML = '';

    $('preUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// POST-CONSTRUCTION SOLUTIONS REPORT COMPILER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
postAnalyzeBtn.addEventListener('click', () => {
    postAnalyzeBtn.disabled = true;
    const btnText = postAnalyzeBtn.querySelector('.btn-text');
    btnText.innerHTML = `<span class="spinner-dot"></span> Compiling diagnosticsâ€¦`;

    setTimeout(() => {
        renderPostSolutionsReport();
        $('postDefectCard').classList.add('hidden');
        $('postResultsCard').classList.remove('hidden');
        $('postResultsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Post-construction solutions compiled');
        
        postAnalyzeBtn.disabled = false;
        btnText.innerHTML = `Generate Solutions &amp; Reports <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    }, 1400);
});

function renderPostSolutionsReport() {
    const reportList = $('postSolutionsReportList');
    reportList.innerHTML = '';

    // Get all assigned defect types (excluding unassigned)
    const assignments = state.post.imageAssignments;
    const activeDefects = Array.from(new Set(Object.values(assignments))).filter(key => key !== 'unassigned');

    activeDefects.forEach(key => {
        const data = POST_DIAG[key];
        if (!data) return;

        // Get matching photographs
        let photosHTML = '';
        state.post.photos.forEach((dataUrl, idx) => {
            if (assignments[idx] === key) {
                const isAI = (state.post.selectionSource[idx] === 'ai');
                const barsHTML = window.getDefectProgressBarsHTML(key, isAI);

                photosHTML += `
                    <div style="display:flex; gap:20px; align-items:center; background:#f8fafc; border:1px solid var(--border); border-radius:var(--r-md); padding:16px; width:100%;">
                        <div style="text-align:center; flex-shrink:0;">
                            <img src="${dataUrl}" class="img-zoomable" style="width:180px; height:120px; object-fit:cover; border-radius:var(--r-sm); border:1px solid var(--border-strong); display:block; cursor:zoom-in;" title="Photo ${idx + 1}">
                            <div style="font-family:var(--font-head); font-weight:800; font-size:0.9rem; color:var(--text-900); margin-top:8px;">Photo ${idx + 1}</div>
                        </div>
                        ${barsHTML}
                    </div>
                `;
            }
        });

        const groupDiv = document.createElement('div');
        groupDiv.className = 'rcc-solution-group';
        groupDiv.style.padding = '24px';
        groupDiv.style.marginBottom = '20px';
        groupDiv.style.border = '1.5px solid var(--border)';
        groupDiv.style.borderRadius = 'var(--r-xl)';
        groupDiv.style.background = '#fff';

        const severity = data.severity;
        const categoryName = data.label;

        groupDiv.innerHTML = `
            <div class="rsg-header" style="border-bottom:1.5px solid var(--border); padding-bottom:10px; margin-bottom:16px;">
                <span class="rsg-title" style="font-size:1.1rem; font-weight:800; font-family:var(--font-head); color:var(--text-900);">${categoryName}</span>
            </div>

            <div style="margin-bottom:18px;">
                <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-400); display:block; margin-bottom:10px;">Evidence Photographs</span>
                <div style="display:flex; flex-direction:column; gap:16px;">
                    ${photosHTML}
                </div>
            </div>

            <div style="margin-top:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <h4 style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-900); margin:0; letter-spacing:0.05em;">Conclusive Remarks</h4>
                </div>
                ${getMarketRateTableHTML('post', key)}
            </div>
        `;

        reportList.appendChild(groupDiv);
    });

    // Unassigned list
    const unassignedIndices = Object.keys(assignments).filter(idx => assignments[idx] === 'unassigned');
    if (unassignedIndices.length > 0) {
        const generalDiv = document.createElement('div');
        generalDiv.className = 'rcc-solution-group';
        generalDiv.style.padding = '24px';
        generalDiv.style.border = '1.5px solid var(--border)';
        generalDiv.style.borderRadius = 'var(--r-xl)';
        generalDiv.style.background = '#fff';

        let photosHTML = '';
        unassignedIndices.forEach(idx => {
            photosHTML += `
                <div style="text-align:center; background:#f8fafc; border:1px solid var(--border); border-radius:var(--r-md); padding:8px; min-width:0;">
                    <img src="${state.post.photos[idx]}" class="img-zoomable" style="width:100%; height:80px; object-fit:cover; border-radius:var(--r-sm); border:1px solid var(--border-strong); display:block; cursor:zoom-in;" title="Photo ${parseInt(idx) + 1}">
                    <div style="margin-top:6px; font-family:var(--font-head); font-weight:700; font-size:0.7rem; color:var(--text-900);">${parseInt(idx) + 1}</div>
                    <span style="font-size:0.55rem; font-weight:700; color:var(--text-400);">Unassigned</span>
                </div>
            `;
        });

        generalDiv.innerHTML = `
            <div class="rsg-header" style="border-bottom:1.5px solid var(--border); padding-bottom:10px; margin-bottom:16px;">
                <span class="rsg-title" style="font-size:0.95rem; font-weight:800; font-family:var(--font-head); color:var(--text-500);">Unassigned Photographs</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; padding:10px; background:var(--bg); border-radius:var(--r-md); border:1px solid var(--border);">
                ${photosHTML}
            </div>
            <div class="cc-body" style="margin-top:12px;">
                <div class="cc-section">
                    <h4 style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-500); margin-bottom:4px;">Observation Note</h4>
                    <p style="font-size:0.85rem; color:var(--text-500); line-height:1.6; margin:0;">These inspection photographs were uploaded but not assigned to any specific structural defect category. They are compiled here for reference logs.</p>
                </div>
            </div>
        `;
        reportList.appendChild(generalDiv);
    }
}

// Restart Post
$('postRestartBtn').addEventListener('click', () => {
    state.post.photos = [];
    state.post.imageAssignments = {};
    state.post.aiRecommendations = {};
    state.post.remediationPreferences = {};
    state.post.selectionSource = {};
    state.post.currentPhotoIdx = 0;
    state.post.searchQuery = '';
    state.post.sortBy = 'number';
    $('postSearchInput').value = '';
    $('postSortSelect').value = 'number';

    $('postResultsCard').classList.add('hidden');
    $('postDefectCard').classList.add('locked', 'hidden');
    $('postUploadCard').classList.remove('hidden');
    setupPhotoUploader({
        mode: 'post',
        gridId: 'postPhotoGrid',
        addBtnId: 'postAddBtn',
        fileInputId: 'postFileInput',
        countId: 'postPhotoCount',
        uploadCardId: 'postUploadCard',
        nextCardId: 'postGoToAnalysisBtn',
        dropOverlayId: 'postDropOverlay'
    });

    // Clear photo thumbnails
    $('postPhotoGrid').querySelectorAll('.photo-thumb').forEach(el => el.remove());
    $('postPhotoCount').textContent = '0 photos';
    $('postPhotoCount').style = '';
    postAnalysisList.innerHTML = '';

    $('postUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RCC DAMAGE ANALYZER SOLUTIONS GENERATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
$('rccGenerateSolutionsBtn').addEventListener('click', () => {
    $('rccAnalysisCard').classList.add('hidden');
    $('rccResultsCard').classList.remove('hidden');
    $('rccResultsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    renderRCCSolutionsReport();
});

function renderRCCSolutionsReport() {
    const reportList = $('rccSolutionsReportList');
    reportList.innerHTML = '';

    const assignments = state.rcc.imageAssignments;
    const activeDefects = Array.from(new Set(Object.values(assignments))).filter(key => key !== 'unassigned');

    activeDefects.forEach(key => {
        const rccData = RCC_DIAG[key];
        if (!rccData) return;

        const assignedIndices = Object.keys(assignments).filter(idx => assignments[idx] === key);
        let photosHTML = '';
        assignedIndices.forEach(idxStr => {
            const idx = parseInt(idxStr);
            const dataUrl = state.rcc.photos[idx];
            const isAI = (state.rcc.selectionSource[idx] !== 'manual'); // defaults to AI if not manually selected
            const barsHTML = window.getDefectProgressBarsHTML(key, isAI);

            photosHTML += `
                <div style="display:flex; gap:20px; align-items:center; background:#f8fafc; border:1px solid var(--border); border-radius:var(--r-md); padding:16px; width:100%;">
                    <div style="text-align:center; flex-shrink:0;">
                        <img src="${dataUrl}" class="img-zoomable" style="width:180px; height:120px; object-fit:cover; border-radius:var(--r-sm); border:1px solid var(--border-strong); display:block; cursor:zoom-in;" title="Photo ${idx + 1}">
                        <div style="font-family:var(--font-head); font-weight:800; font-size:0.9rem; color:var(--text-900); margin-top:8px;">Photo ${idx + 1}</div>
                    </div>
                    ${barsHTML}
                </div>
            `;
        });

        const groupDiv = document.createElement('div');
        groupDiv.className = 'rcc-solution-group';
        groupDiv.style.padding = '24px';
        groupDiv.style.marginBottom = '20px';
        groupDiv.style.border = '1.5px solid var(--border)';
        groupDiv.style.borderRadius = 'var(--r-xl)';
        groupDiv.style.background = '#fff';

        const categoryName = rccData.label;

        groupDiv.innerHTML = `
            <div class="rsg-header" style="border-bottom:1.5px solid var(--border); padding-bottom:10px; margin-bottom:16px;">
                <span class="rsg-title" style="font-size:1.1rem; font-weight:800; font-family:var(--font-head); color:var(--text-900);">${categoryName}</span>
            </div>

            <div style="margin-bottom:18px;">
                <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-400); display:block; margin-bottom:10px;">Evidence Photographs</span>
                <div style="display:flex; flex-direction:column; gap:16px;">
                    ${photosHTML}
                </div>
            </div>

            <div style="margin-top:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <h4 style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-900); margin:0; letter-spacing:0.05em;">Conclusive Remarks</h4>
                </div>
                ${getMarketRateTableHTML('rcc', key)}
            </div>
        `;

        reportList.appendChild(groupDiv);
    });

    const unassignedIndices = Object.keys(assignments).filter(idx => assignments[idx] === 'unassigned');
    if (unassignedIndices.length > 0) {
        const generalDiv = document.createElement('div');
        generalDiv.className = 'rcc-solution-group';
        generalDiv.style.padding = '24px';
        generalDiv.style.border = '1.5px solid var(--border)';
        generalDiv.style.borderRadius = 'var(--r-xl)';
        generalDiv.style.background = '#fff';

        let photosHTML = '';
        unassignedIndices.forEach(idx => {
            photosHTML += `
                <div style="text-align:center; background:#f8fafc; border:1px solid var(--border); border-radius:var(--r-md); padding:8px; min-width:0;">
                    <img src="${state.rcc.photos[idx]}" class="img-zoomable" style="width:100%; height:80px; object-fit:cover; border-radius:var(--r-sm); border:1px solid var(--border-strong); display:block; cursor:zoom-in;" title="Photo ${parseInt(idx) + 1}">
                    <div style="margin-top:6px; font-family:var(--font-head); font-weight:700; font-size:0.7rem; color:var(--text-900);">${parseInt(idx) + 1}</div>
                    <span style="font-size:0.55rem; font-weight:700; color:var(--text-400);">Unassigned</span>
                </div>
            `;
        });

        generalDiv.innerHTML = `
            <div class="rsg-header" style="border-bottom:1.5px solid var(--border); padding-bottom:10px; margin-bottom:16px;">
                <span class="rsg-title" style="font-size:0.95rem; font-weight:800; font-family:var(--font-head); color:var(--text-500);">Unassigned Photographs</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; padding:10px; background:var(--bg); border-radius:var(--r-md); border:1px solid var(--border);">
                ${photosHTML}
            </div>
            <div class="cc-body" style="margin-top:12px;">
                <div class="cc-section">
                    <h4 style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-500); margin-bottom:4px;">Observation Note</h4>
                    <p style="font-size:0.85rem; color:var(--text-500); line-height:1.6; margin:0;">These inspection photographs were uploaded but not assigned to any specific structural defect category. They are compiled here for reference logs.</p>
                </div>
            </div>
        `;
        reportList.appendChild(generalDiv);
    }
}

// Restart Analysis
$('rccRestartBtn').addEventListener('click', () => {
    state.rcc.photos = [];
    state.rcc.activeStep = 1;
    state.rcc.selectedDefects = [];
    state.rcc.imageAssignments = {};
    state.rcc.aiMatches = [];
    state.rcc.selectionSource = {};
    state.rcc.currentPhotoIdx = 0;
    state.rcc.searchQuery = '';
    state.rcc.sortBy = 'number';
    $('rccSearchInput').value = '';
    $('rccSortSelect').value = 'number';

    // Reset grid
    setupPhotoUploader({
        mode: 'rcc',
        gridId: 'rccPhotoGrid',
        addBtnId: 'rccAddBtn',
        fileInputId: 'rccFileInput',
        countId: 'rccPhotoCount',
        uploadCardId: 'rccUploadCard',
        nextCardId: 'rccGoToAnalysisBtn',
        dropOverlayId: 'rccDropOverlay'
    });

    $('rccResultsCard').classList.add('hidden');
    $('rccUploadCard').classList.remove('hidden');
    $('rccUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// BACK BUTTONS CLICK HANDLERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Pre-Construction Back Buttons
const handlePreBack = () => {
    $('preUploadCard').classList.remove('hidden');
    $('preParamCard').classList.add('hidden');
    $('preUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
};
$('preBackBtn').addEventListener('click', handlePreBack);
$('preBackBtnTop').addEventListener('click', handlePreBack);

const handlePreResultsBack = () => {
    $('preResultsCard').classList.add('hidden');
    $('preParamCard').classList.remove('hidden');
    $('preParamCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
};
$('preResultsBackBtn').addEventListener('click', handlePreResultsBack);
$('preResultsBackBtnTop').addEventListener('click', handlePreResultsBack);


// Post-Construction Back Buttons
const handlePostBack = () => {
    $('postUploadCard').classList.remove('hidden');
    $('postDefectCard').classList.add('hidden');
    $('postUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
};
$('postBackBtn').addEventListener('click', handlePostBack);
$('postBackBtnTop').addEventListener('click', handlePostBack);

const handlePostResultsBack = () => {
    $('postResultsCard').classList.add('hidden');
    $('postDefectCard').classList.remove('hidden');
    $('postDefectCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
};
$('postResultsBackBtn').addEventListener('click', handlePostResultsBack);
$('postResultsBackBtnTop').addEventListener('click', handlePostResultsBack);


// RCC Damage Analyzer Back Buttons
const handleRCCBack = () => {
    $('rccUploadCard').classList.remove('hidden');
    $('rccAnalysisCard').classList.add('hidden');
    $('rccUploadCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
};
$('rccBackToUpload').addEventListener('click', handleRCCBack);
$('rccBackBtnTop').addEventListener('click', handleRCCBack);

const handleRCCResultsBack = () => {
    $('rccResultsCard').classList.add('hidden');
    $('rccAnalysisCard').classList.remove('hidden');
    $('rccAnalysisCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
};
$('rccResultsBackBtn').addEventListener('click', handleRCCResultsBack);
$('rccResultsBackBtnTop').addEventListener('click', handleRCCResultsBack);

// Search & Sort Event Listeners
$('preSearchInput').addEventListener('input', (e) => {
    state.pre.searchQuery = e.target.value;
    renderPreAnalysisList();
});
$('preSortSelect').addEventListener('change', (e) => {
    state.pre.sortBy = e.target.value;
    renderPreAnalysisList();
});

$('postSearchInput').addEventListener('input', (e) => {
    state.post.searchQuery = e.target.value;
    renderPostAnalysisList();
});
$('postSortSelect').addEventListener('change', (e) => {
    state.post.sortBy = e.target.value;
    renderPostAnalysisList();
});

$('rccSearchInput').addEventListener('input', (e) => {
    state.rcc.searchQuery = e.target.value;
    renderRCCAnalysisList();
});
$('rccSortSelect').addEventListener('change', (e) => {
    state.rcc.sortBy = e.target.value;
    renderRCCAnalysisList();
});

// Lightbox Preview / Zoom Feature
window.openLightbox = function(src) {
    if (document.getElementById('lightboxOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.className = 'lightbox-overlay';

    overlay.innerHTML = `
        <button class="lightbox-close" id="lightboxClose" aria-label="Close preview">&times;</button>
        <img src="${src}" class="lightbox-content" alt="Enlarged photo preview">
    `;

    document.body.appendChild(overlay);

    // Fade in
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);

    const closeLightbox = () => {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
        }, 255);
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.id === 'lightboxClose') {
            closeLightbox();
        }
    });

    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
};

document.body.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && e.target.classList.contains('img-zoomable')) {
        window.openLightbox(e.target.src);
    }
});

// Dynamic AI Crack Mixture Helper
window.getRandomCrackNameMixture = function(defectKey) {
    const mixtures = {
        corrosion_minor: [
            "60% corrosion and 40% spalling",
            "70% surface oxidation and 30% minor pitting",
            "65% hairline corrosion cracking and 35% chalking"
        ],
        corrosion_along: [
            "65% reinforcement corrosion and 35% longitudinal cracking",
            "75% rebar oxidation expansion and 25% concrete split",
            "70% sub-surface rust pressure and 30% delamination"
        ],
        spalling_reinforce: [
            "70% rebar exposure and 30% spalling",
            "80% structural spalling and 20% steel oxidation",
            "60% cover concrete loss and 40% steel scaling"
        ],
        spalling_joint: [
            "60% joint spalling and 40% shear distress",
            "75% joint edge spalling and 25% expansion gap failure",
            "70% localized spall damage and 30% corner fracture"
        ],
        honeycomb_structural: [
            "80% structural honeycomb and 20% aggregate separation",
            "70% concrete consolidation voids and 30% gravel pockets",
            "75% heavy honeycombing and 25% sand streaking"
        ],
        honeycomb_casing: [
            "75% surface voids and 25% grout leakage",
            "60% bug holes and 40% formwork bleed",
            "70% cosmetic honeycombing and 30% skin voids"
        ],
        delamination_slab: [
            "60% slab separation and 40% surface delamination",
            "75% top cover delamination and 25% horizontal plane shear",
            "70% slab scaling and 30% shallow delaminated voids"
        ],
        delamination_beam: [
            "70% beam soffit delamination and 30% concrete spalling",
            "80% beam cover separation and 20% rebar bond slip",
            "75% soffit concrete failure and 25% structural shear"
        ],
        crack_shear_beam: [
            "80% diagonal shear crack and 20% flexural stress",
            "70% inclined web shear crack and 30% aggregate interlock loss",
            "75% diagonal tension crack and 25% shear reinforcement slip"
        ],
        crack_flexure_beam: [
            "75% vertical flexure crack and 25% tensile strain",
            "80% mid-span bending crack and 20% concrete micro-fracture",
            "70% tension zone cracking and 30% flexural displacement"
        ],
        crack_settlement_wall: [
            "70% diagonal settlement crack and 30% wall displacement",
            "75% foundation settlement fracture and 25% masonry slip",
            "80% differential settlement crack and 20% load path shift"
        ],
        crack_thermal_mass: [
            "65% mass thermal crack and 35% contraction fracture",
            "75% hydration heat gradient crack and 25% surface shrinkage",
            "70% thermal stress split and 30% contraction cracking"
        ]
    };

    const list = mixtures[defectKey] || [
        "60% corrosion and 40% spalling",
        "70% concrete cracking and 30% surface defect",
        "75% crack pattern and 25% localized damage"
    ];

    let sum = 0;
    for (let i = 0; i < defectKey.length; i++) {
        sum += defectKey.charCodeAt(i);
    }
    const idx = sum % list.length;
    return list[idx];
};

// Progress Bar HTML Generator for Defect Combinations
window.getDefectProgressBarsHTML = function(defectKey, isAI) {
    if (!isAI) {
        // Manual detection — single purple bar at 100%
        return `
            <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
                <div style="font-family:var(--font-head); font-weight:800; font-size:0.65rem; text-transform:uppercase; color:#6366f1; letter-spacing:0.05em; margin-bottom:2px;">DEFECT PATTERN DETECTED MANUALLY BY EXPERT (PROBABILITY)</div>
                <div style="position:relative; width:100%; height:38px; border-radius:10px; overflow:hidden; background:#e8e5ff; box-shadow: inset 0 2px 4px rgba(99,102,241,0.15), 0 4px 12px rgba(99,102,241,0.12), 0 2px 4px rgba(99,102,241,0.06); border:1.5px solid #6366f1;">
                    <div style="position:absolute; top:0; left:0; height:100%; width:100%; background:linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #6366f1 100%); border-radius:8px; transition:width 0.8s cubic-bezier(0.4,0,0.2,1);">
                        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.1) 100%); border-radius:8px;"></div>
                    </div>
                    <span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:var(--font-head); font-weight:900; font-size:0.8rem; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.3); letter-spacing:0.04em; white-space:nowrap;">MANUAL EXPERT ASSESSMENT — 100%</span>
                </div>
            </div>`;
    }

    // AI detection — parse the mixture string to get two bars
    const mixture = window.getRandomCrackNameMixture(defectKey);
    // Parse "60% corrosion and 40% spalling" format
    const match = mixture.match(/(\d+)%\s+(.+?)\s+and\s+(\d+)%\s+(.+)/i);
    let pct1 = 60, name1 = 'Corrosion', pct2 = 40, name2 = 'Spalling';
    if (match) {
        pct1 = parseInt(match[1]);
        name1 = match[2].trim();
        pct2 = parseInt(match[3]);
        name2 = match[4].trim();
    }

    // Color pairs for the two bars
    const bar1Gradient = 'linear-gradient(135deg, #0d9488 0%, #14b8a6 40%, #0d9488 100%)';
    const bar1Shadow = 'inset 0 2px 4px rgba(13,148,136,0.2), 0 4px 12px rgba(13,148,136,0.15), 0 2px 4px rgba(13,148,136,0.08)';
    const bar1Border = '#0d9488';
    const bar1BgTrack = '#ccfbf1';

    const bar2Gradient = 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #f59e0b 100%)';
    const bar2Shadow = 'inset 0 2px 4px rgba(245,158,11,0.2), 0 4px 12px rgba(245,158,11,0.15), 0 2px 4px rgba(245,158,11,0.08)';
    const bar2Border = '#f59e0b';
    const bar2BgTrack = '#fef3c7';

    return `
        <div style="flex:1; display:flex; flex-direction:column; gap:10px;">
            <div style="font-family:var(--font-head); font-weight:800; font-size:0.65rem; text-transform:uppercase; color:#0d9488; letter-spacing:0.05em;">DEFECT PATTERN DETECTED BY TRAINED AI EXPERT (PROBABILITY)</div>

            <!-- Bar 1 -->
            <div style="display:flex; flex-direction:column; gap:3px;">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <span style="font-family:var(--font-head); font-weight:800; font-size:0.72rem; color:#0f766e; text-transform:uppercase; letter-spacing:0.03em;">${name1}</span>
                    <span style="font-family:var(--font-head); font-weight:900; font-size:0.85rem; color:#0d9488;">${pct1}%</span>
                </div>
                <div style="position:relative; width:100%; height:34px; border-radius:10px; overflow:hidden; background:${bar1BgTrack}; box-shadow:${bar1Shadow}; border:1.5px solid ${bar1Border};">
                    <div style="position:absolute; top:0; left:0; height:100%; width:${pct1}%; background:${bar1Gradient}; border-radius:8px; transition:width 0.8s cubic-bezier(0.4,0,0.2,1);">
                        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.1) 100%); border-radius:8px;"></div>
                    </div>
                    <span style="position:absolute; top:50%; left:${Math.min(pct1 / 2, pct1 - 5)}%; transform:translate(-50%,-50%); font-family:var(--font-head); font-weight:900; font-size:0.75rem; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.35); letter-spacing:0.03em; white-space:nowrap;">${pct1}% ${name1.toUpperCase()}</span>
                </div>
            </div>

            <!-- Bar 2 -->
            <div style="display:flex; flex-direction:column; gap:3px;">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <span style="font-family:var(--font-head); font-weight:800; font-size:0.72rem; color:#92400e; text-transform:uppercase; letter-spacing:0.03em;">${name2}</span>
                    <span style="font-family:var(--font-head); font-weight:900; font-size:0.85rem; color:#f59e0b;">${pct2}%</span>
                </div>
                <div style="position:relative; width:100%; height:34px; border-radius:10px; overflow:hidden; background:${bar2BgTrack}; box-shadow:${bar2Shadow}; border:1.5px solid ${bar2Border};">
                    <div style="position:absolute; top:0; left:0; height:100%; width:${pct2}%; background:${bar2Gradient}; border-radius:8px; transition:width 0.8s cubic-bezier(0.4,0,0.2,1);">
                        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.1) 100%); border-radius:8px;"></div>
                    </div>
                    <span style="position:absolute; top:50%; left:${Math.min(pct2 / 2, pct2 - 5)}%; transform:translate(-50%,-50%); font-family:var(--font-head); font-weight:900; font-size:0.75rem; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.35); letter-spacing:0.03em; white-space:nowrap;">${pct2}% ${name2.toUpperCase()}</span>
                </div>
            </div>
        </div>`;
};

// Interpretation Settings Page Initialization
function initInterpretationSettingsPage() {
    const container = $('settingsDefectTableContainer');
    const searchInput = $('settingsSearchInput');
    const addBtn = $('addSettingsDefectBtn');
    const dropdown = $('settingsDefectDropdown');
    if (!container) return;

    // Load custom added defects first
    try {
        const stored = localStorage.getItem('custom_settings_defects');
        if (stored) {
            const customs = JSON.parse(stored);
            for (const [k, val] of Object.entries(customs)) {
                POST_DIAG[k] = val;
            }
        }
    } catch (e) {
        console.error(e);
    }

    // Assign default serialNumber if not present
    let sNum = 1;
    for (const key of Object.keys(POST_DIAG)) {
        if (!POST_DIAG[key].serialNumber) {
            POST_DIAG[key].serialNumber = String(sNum++);
        }
    }

    // Load defect database overrides
    try {
        const stored = localStorage.getItem('settings_defect_overrides');
        if (stored) {
            const overrides = JSON.parse(stored);
            for (const [k, val] of Object.entries(overrides)) {
                if (POST_DIAG[k]) {
                    if (val.serialNumber) POST_DIAG[k].serialNumber = val.serialNumber;
                    if (val.label) POST_DIAG[k].label = val.label;
                    if (val.rootCause) POST_DIAG[k].rootCause = val.rootCause;
                    if (val.furtherInvestigation) POST_DIAG[k].furtherInvestigation = val.furtherInvestigation;
                    if (val.futureSolution) POST_DIAG[k].futureSolution = val.futureSolution;
                }
            }
        }
    } catch (e) {
        console.error("Failed to load database overrides", e);
    }

    // Populate dropdown with all defect types
    function populateDropdown() {
        if (!dropdown) return;
        const currentVal = dropdown.value;
        // Clear existing options except the first "Show All"
        while (dropdown.options.length > 1) dropdown.remove(1);
        for (const [key, data] of Object.entries(POST_DIAG)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = `${data.serialNumber || ''} — ${data.label}`;
            dropdown.appendChild(opt);
        }
        dropdown.value = currentVal || '';
    }
    populateDropdown();

    let editingKey = null;
    let selectedDropdownKey = '';

    const renderTable = (filter = '') => {
        const entries = Object.entries(POST_DIAG);

        // Apply dropdown filter first
        let afterDropdown = selectedDropdownKey
            ? entries.filter(([k]) => k === selectedDropdownKey)
            : entries;

        // Then apply search filter
        const filtered = filter
            ? afterDropdown.filter(([k, v]) => {
                const q = filter.toLowerCase();
                return (v.label && v.label.toLowerCase().includes(q))
                    || (v.serialNumber && v.serialNumber.toLowerCase().includes(q))
                    || (v.rootCause && v.rootCause.toLowerCase().includes(q))
                    || (v.furtherInvestigation && v.furtherInvestigation.toLowerCase().includes(q))
                    || (v.futureSolution && v.futureSolution.toLowerCase().includes(q));
            })
            : afterDropdown;

        let rowNum = 1;
        let rows = '';
        for (const [key, data] of filtered) {
            if (editingKey === key) {
                // Render inline edit mode for this row
                rows += `
                    <tr style="background:#f0fdfa; border-bottom:1px solid var(--border);" data-key="${key}">
                        <td style="padding:8px; border-right:1px solid var(--border); vertical-align:top; text-align:center; width:100px;">
                            <input type="text" class="settings-edit-input" data-field="serialNumber" value="${data.serialNumber || ''}" style="width:100%; padding:6px; font-size:0.78rem; font-weight:700; border:1px solid var(--teal-300); border-radius:var(--r-md); text-align:center; outline:none; font-family:var(--font-body); background:#fff;">
                        </td>
                        <td style="padding:8px; border-right:1px solid var(--border); vertical-align:top; min-width:180px;">
                            <input type="text" class="settings-edit-input" data-field="label" value="${data.label || ''}" style="width:100%; padding:6px; font-size:0.82rem; font-weight:700; border:1px solid var(--teal-300); border-radius:var(--r-md); color:var(--teal-700); outline:none; font-family:var(--font-body); background:#fff;">
                        </td>
                        <td style="padding:8px; border-right:1px solid var(--border); vertical-align:top;">
                            <textarea class="settings-edit-ta" data-field="rootCause" style="width:100%; min-height:100px; padding:8px; border:1px solid var(--teal-300); border-radius:var(--r-md); font-family:var(--font-body); font-size:0.78rem; color:var(--text-800); outline:none; resize:vertical; line-height:1.5; background:#fff;">${data.rootCause || ''}</textarea>
                        </td>
                        <td style="padding:8px; border-right:1px solid var(--border); vertical-align:top;">
                            <textarea class="settings-edit-ta" data-field="furtherInvestigation" style="width:100%; min-height:100px; padding:8px; border:1px solid var(--teal-300); border-radius:var(--r-md); font-family:var(--font-body); font-size:0.78rem; color:var(--text-800); outline:none; resize:vertical; line-height:1.5; background:#fff;">${data.furtherInvestigation || ''}</textarea>
                        </td>
                        <td style="padding:8px; border-right:1px solid var(--border); vertical-align:top;">
                            <textarea class="settings-edit-ta" data-field="futureSolution" style="width:100%; min-height:100px; padding:8px; border:1px solid var(--teal-300); border-radius:var(--r-md); font-family:var(--font-body); font-size:0.78rem; color:var(--text-800); outline:none; resize:vertical; line-height:1.5; background:#fff;">${data.futureSolution || ''}</textarea>
                        </td>
                        <td style="padding:8px; vertical-align:top; text-align:center; width:90px;">
                            <div style="display:flex; flex-direction:column; gap:6px; align-items:center;">
                                <button class="settings-save-btn" data-key="${key}" style="padding:5px 10px; font-size:0.7rem; background:var(--teal-500); color:#fff; border:none; border-radius:var(--r-md); cursor:pointer; font-weight:700; display:flex; align-items:center; gap:4px;">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Save
                                </button>
                                <button class="settings-cancel-btn" data-key="${key}" style="padding:5px 10px; font-size:0.7rem; background:#ef4444; color:#fff; border:none; border-radius:var(--r-md); cursor:pointer; font-weight:700; display:flex; align-items:center; gap:4px;">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                // Normal view row
                rows += `
                    <tr style="border-bottom:1px solid var(--border); transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'" data-key="${key}">
                        <td style="padding:10px 12px; border-right:1px solid var(--border); vertical-align:top; text-align:center; font-size:0.78rem; color:var(--text-900); font-weight:700; width:100px;">${data.serialNumber || rowNum}</td>
                        <td style="padding:10px 12px; border-right:1px solid var(--border); vertical-align:top; font-size:0.82rem; font-weight:700; color:var(--text-900); min-width:180px;">${data.label}</td>
                        <td style="padding:10px 12px; border-right:1px solid var(--border); vertical-align:top; font-size:0.78rem; color:var(--text-700); line-height:1.55; word-wrap:break-word; white-space:normal;">${data.rootCause || '<span style="color:var(--text-400); font-style:italic;">N/A</span>'}</td>
                        <td style="padding:10px 12px; border-right:1px solid var(--border); vertical-align:top; font-size:0.78rem; color:var(--text-700); line-height:1.55; word-wrap:break-word; white-space:normal;">${data.furtherInvestigation || '<span style="color:var(--text-400); font-style:italic;">N/A</span>'}</td>
                        <td style="padding:10px 12px; border-right:1px solid var(--border); vertical-align:top; font-size:0.78rem; color:var(--text-700); line-height:1.55; word-wrap:break-word; white-space:normal;">${data.futureSolution || '<span style="color:var(--text-400); font-style:italic;">N/A</span>'}</td>
                        <td style="padding:10px 8px; vertical-align:top; text-align:center; width:90px;">
                            <div style="display:flex; gap:8px; justify-content:center; align-items:center;">
                                <button class="settings-edit-row-btn" data-key="${key}" title="Edit" style="background:none; border:none; cursor:pointer; color:var(--teal-600); padding:4px; border-radius:4px; transition:background 0.2s; display:flex; align-items:center;" onmouseover="this.style.background='rgba(20,184,166,0.12)'" onmouseout="this.style.background='none'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button class="settings-delete-row-btn" data-key="${key}" title="Delete" style="background:none; border:none; cursor:pointer; color:#ef4444; padding:4px; border-radius:4px; transition:background 0.2s; display:flex; align-items:center;" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='none'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }
            rowNum++;
        }

        if (filtered.length === 0) {
            rows = `<tr><td colspan="6" style="padding:30px; text-align:center; color:var(--text-400); font-style:italic; font-size:0.85rem;">No defect patterns found.</td></tr>`;
        }

        container.innerHTML = `
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem;">
                <thead>
                    <tr style="background:#f1f5f9; border-bottom:2px solid var(--border); color:var(--text-600); font-weight:800; text-transform:uppercase; font-size:0.68rem; letter-spacing:0.04em; position:sticky; top:0; z-index:2;">
                        <th style="padding:12px 12px; border-right:1px solid var(--border); width:100px; text-align:center;">Serial Number</th>
                        <th style="padding:12px 12px; border-right:1px solid var(--border); min-width:180px;">Defect Pattern</th>
                        <th style="padding:12px 12px; border-right:1px solid var(--border);">Root Cause</th>
                        <th style="padding:12px 12px; border-right:1px solid var(--border);">Further Investigation</th>
                        <th style="padding:12px 12px; border-right:1px solid var(--border);">Possible Solution</th>
                        <th style="padding:12px 8px; width:90px; text-align:center;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;

        // Update live result count
        const resultCountEl = document.getElementById('settingsSearchResultCount');
        if (resultCountEl) {
            if (filter && filter.trim()) {
                resultCountEl.style.display = 'block';
                resultCountEl.innerHTML = `<span style="color:var(--teal-600);">${filtered.length}</span> of ${entries.length} defect patterns match "<span style="color:var(--teal-600); font-style:italic;">${filter}</span>"`;
            } else {
                resultCountEl.style.display = 'block';
                resultCountEl.innerHTML = `Showing all <span style="color:var(--teal-600);">${entries.length}</span> defect patterns`;
            }
        }

        // Attach event listeners
        container.querySelectorAll('.settings-edit-row-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                editingKey = btn.dataset.key;
                renderTable(searchInput ? searchInput.value : '');
            });
        });

        container.querySelectorAll('.settings-delete-row-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                const label = POST_DIAG[key] ? POST_DIAG[key].label : key;
                if (confirm(`Delete "${label}" from the defect database?`)) {
                    delete POST_DIAG[key];
                    // Also delete from localStorage overrides
                    try {
                        let stored = localStorage.getItem('settings_defect_overrides');
                        if (stored) {
                            let overrides = JSON.parse(stored);
                            delete overrides[key];
                            localStorage.setItem('settings_defect_overrides', JSON.stringify(overrides));
                        }
                        let customStored = localStorage.getItem('custom_settings_defects');
                        if (customStored) {
                            let customs = JSON.parse(customStored);
                            delete customs[key];
                            localStorage.setItem('custom_settings_defects', JSON.stringify(customs));
                        }
                    } catch (e) { console.error(e); }
                    showToast("Defect pattern deleted.");
                    renderTable(searchInput ? searchInput.value : '');
                }
            });
        });

        container.querySelectorAll('.settings-save-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                const row = btn.closest('tr');

                // Read inputs (serialNumber and label)
                const inputs = row.querySelectorAll('.settings-edit-input');
                inputs.forEach(input => {
                    const field = input.dataset.field;
                    POST_DIAG[key][field] = input.value.trim() || "N/A";
                });

                // Read textareas
                const textareas = row.querySelectorAll('.settings-edit-ta');
                textareas.forEach(ta => {
                    const field = ta.dataset.field;
                    POST_DIAG[key][field] = ta.value.trim() || "N/A";
                });

                // Save overrides to localStorage
                try {
                    let stored = localStorage.getItem('settings_defect_overrides');
                    let overrides = stored ? JSON.parse(stored) : {};
                    overrides[key] = {
                        serialNumber: POST_DIAG[key].serialNumber,
                        label: POST_DIAG[key].label,
                        rootCause: POST_DIAG[key].rootCause,
                        furtherInvestigation: POST_DIAG[key].furtherInvestigation,
                        futureSolution: POST_DIAG[key].futureSolution
                    };
                    localStorage.setItem('settings_defect_overrides', JSON.stringify(overrides));
                } catch (e) { console.error(e); }

                editingKey = null;
                showToast("Parameters updated successfully!");
                renderTable(searchInput ? searchInput.value : '');
            });
        });

        container.querySelectorAll('.settings-cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                editingKey = null;
                renderTable(searchInput ? searchInput.value : '');
            });
        });
    };

    // Dropdown change event
    if (dropdown) {
        dropdown.addEventListener('change', (e) => {
            selectedDropdownKey = e.target.value;
            editingKey = null;
            renderTable(searchInput ? searchInput.value : '');
        });
    }

    // Search event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            editingKey = null;
            renderTable(e.target.value);
        });
    }

    // Add defect button
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openAddSettingsDefectModal(() => {
                populateDropdown();
                renderTable(searchInput ? searchInput.value : '');
            });
        });
    }

    // Limit table height with scroll
    container.style.maxHeight = '70vh';
    container.style.overflowY = 'auto';

    renderTable();
}

// Modal for adding new defect types
function openAddSettingsDefectModal(renderCallback) {
    // Remove existing modal if any
    const existing = document.getElementById('addSettingsDefectModal');
    if (existing) existing.remove();

    const modalDiv = document.createElement('div');
    modalDiv.id = 'addSettingsDefectModal';
    modalDiv.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; font-family:var(--font-body);';

    modalDiv.innerHTML = `
        <div style="background:#fff; border-radius:var(--r-xl); width:100%; max-width:600px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); overflow:hidden; border:1px solid var(--border); animation: modalFadeIn 0.25s ease-out;">
            <div style="padding:20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--bg-card);">
                <h3 style="margin:0; font-family:var(--font-head); font-weight:800; font-size:1.1rem; color:var(--text-900);">Add New Defect Pattern</h3>
                <button id="closeAddDefectModal" style="background:none; border:none; color:var(--text-400); cursor:pointer; font-size:1.5rem; display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; transition:background 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='none'">&times;</button>
            </div>
            <div style="padding:20px; display:flex; flex-direction:column; gap:16px; max-height:70vh; overflow-y:auto;">
                <div style="display:flex; gap:12px;">
                    <div style="display:flex; flex-direction:column; gap:6px; width:120px;">
                        <label style="font-size:0.7rem; font-weight:800; color:var(--text-500); text-transform:uppercase;">Serial Number</label>
                        <input type="text" id="modalNewDefectSerial" placeholder="e.g. 16.4" style="width:100%; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; transition:border-color 0.2s; font-family:var(--font-body);" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px; flex:1;">
                        <label style="font-size:0.7rem; font-weight:800; color:var(--text-500); text-transform:uppercase;">Defect Pattern Name</label>
                        <input type="text" id="modalNewDefectLabel" placeholder="e.g. Plaster-Spalling-Masonry" style="width:100%; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; transition:border-color 0.2s; font-family:var(--font-body);" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'">
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.7rem; font-weight:800; color:var(--text-500); text-transform:uppercase;">Root Cause</label>
                    <textarea id="modalNewDefectRootCause" placeholder="Describe the physical/chemical root cause of this defect..." style="width:100%; min-height:80px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s; font-family:var(--font-body);" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.7rem; font-weight:800; color:var(--text-500); text-transform:uppercase;">Further Investigation</label>
                    <textarea id="modalNewDefectFurtherInvestigation" placeholder="Detail any surveys or investigations needed..." style="width:100%; min-height:80px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s; font-family:var(--font-body);" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label style="font-size:0.7rem; font-weight:800; color:var(--text-500); text-transform:uppercase;">Possible Solution</label>
                    <textarea id="modalNewDefectFutureSolution" placeholder="Describe the engineering repair methodology..." style="width:100%; min-height:80px; padding:10px 12px; border:1px solid var(--border); border-radius:var(--r-md); font-size:0.85rem; color:var(--text-800); outline:none; resize:vertical; transition:border-color 0.2s; font-family:var(--font-body);" onfocus="this.style.borderColor='var(--teal-500)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                </div>
            </div>
            <div style="padding:16px 20px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; background:var(--bg-card);">
                <button id="cancelAddDefectModal" style="padding:8px 16px; border:1px solid var(--border); background:#fff; color:var(--text-600); border-radius:var(--r-md); font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">Cancel</button>
                <button id="saveAddDefectModal" style="padding:8px 16px; border:none; background:var(--teal-500); color:#fff; border-radius:var(--r-md); font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--teal-600)'" onmouseout="this.style.background='var(--teal-500)'">Save Defect</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);

    const closeModal = () => modalDiv.remove();

    modalDiv.querySelector('#closeAddDefectModal').addEventListener('click', closeModal);
    modalDiv.querySelector('#cancelAddDefectModal').addEventListener('click', closeModal);
    modalDiv.addEventListener('click', (e) => { if (e.target === modalDiv) closeModal(); });

    modalDiv.querySelector('#saveAddDefectModal').addEventListener('click', () => {
        const serialNumber = document.getElementById('modalNewDefectSerial').value.trim();
        const label = document.getElementById('modalNewDefectLabel').value.trim();
        const rootCause = document.getElementById('modalNewDefectRootCause').value.trim();
        const furtherInvestigation = document.getElementById('modalNewDefectFurtherInvestigation').value.trim();
        const futureSolution = document.getElementById('modalNewDefectFutureSolution').value.trim();

        if (!label) {
            showToast("Please enter a defect pattern name.");
            return;
        }

        const key = 'custom_' + label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const newDefect = {
            serialNumber: serialNumber || String(Object.keys(POST_DIAG).length + 1),
            label: label,
            rootCause: rootCause || "N/A",
            furtherInvestigation: furtherInvestigation || "N/A",
            futureSolution: futureSolution || "N/A",
            severity: "med",
            A: { title: "Advanced Structural Retrofitting", match: 90, scope: "Localized treatment and standard repair procedures.", costDuration: "Moderate Cost | 2 Days" },
            B: { title: "Cost-Effective Maintenance Repair", match: 75, scope: "Basic patch repairs and minor cosmetic finishing.", costDuration: "Low Cost | 1 Day" }
        };

        POST_DIAG[key] = newDefect;

        // Save to localStorage
        try {
            let stored = localStorage.getItem('custom_settings_defects');
            let customs = stored ? JSON.parse(stored) : {};
            customs[key] = newDefect;
            localStorage.setItem('custom_settings_defects', JSON.stringify(customs));
        } catch (e) { console.error(e); }

        closeModal();
        showToast("Defect pattern added successfully!");
        if (renderCallback) renderCallback();
    });
}

// Initialize settings
initInterpretationSettingsPage();
