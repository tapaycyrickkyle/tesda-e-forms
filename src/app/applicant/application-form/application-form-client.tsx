"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCertificate,
  faChevronRight,
  faClipboardCheck,
  faGraduationCap,
  faIdCard,
  faPrint,
  faSave,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  collectFormValues,
  generateConsentFormPdfBlob,
  generateFilledApplicationPdfBlob,
  generateSAGCompilationPdfBlob,
} from "@/lib/application-pdf";
import { selfAssessmentGuides as extractedSelfAssessmentGuides } from "./self-assessment-guides";

type FormLanguage = "en" | "tl";
const MY_APPLICATION_BATCHES_KEY = "tesda_my_application_batches";
type SelfAssessmentGuide = {
  title: string;
  sections: Array<{
    project?: string;
    heading: string;
    title?: string;
    questions: string[];
  }>;
};

const selfAssessmentGuides: Record<string, SelfAssessmentGuide> = {
  Beekeeping: {
    title: "Self-Assessment Guide - Beekeeping",
    sections: [
      {
        heading: "Establish Hived Colonies in a Bee Yard",
        title: "ESTABLISH HIVED COLONIES IN A BEE YARD",
        questions: [
          "Identify species of bee that can be grown and has economic feasibility *",
          "Identify the characteristics of a reliable source/supplier of hives and hive stand",
          "Select hive appropriate to the species of bee and checks its cleanliness*",
          "Inspect specification requirements of hives and hive stand",
          "Select location favorable for setting-up hive *",
          "Discuss the installation of starter colony of specific species",
          "Demonstrate cleaning and disinfection of hives",
          "Check working condition of hives and performs simple repair, if necessary",
          "Check the need to replenish food following industry practice",
          "Clean, make inventory and store tools & equipment after establishing hived colonies",
          "Manage wastes (reduce, reuse, recycle) and/or disposes following environmental regulations",
          "Apply safety and health measures according to safety and health standards of industry",
        ],
      },
      {
        heading: "Manage Bee Colony",
        title: "MANAGE BEE COLONY",
        questions: [
          "Inspect bee colony for pests and/or diseases following industry practice",
          "Clean hives and rotate frame to prevent diseases, following industry practice",
          "Demonstrate treatment and/or apply corrective measures on bee colony with pests/diseases following industry practice",
          "Identify type of feed supplement and computes amount needed for a given number of colonies",
          "Assess health and performance of colony following industry practice",
          "Apply re queening procedure (particularly queen catching and marking) following industry practice",
          "Describe how to capture bee swarm using appropriate tools and equipment and following industry procedure",
        ],
      },
      {
        heading: "Propagate Bee Colony",
        title: "PROPAGATE BEE COLONY",
        questions: [
          "Conduct preparatory activities for propagating bee colony following industry practice",
          "Perform division of colony according to industry practice",
          "Identify indicators on readiness of colony to divide",
          "Assess status and strength of colony (ex. presence of good queen, sufficiency of food supply, presence of pest/diseases)",
          "Describe preparation of queenless nucs colony following industry practice",
          "Demonstrate introduction of queen to nucs, following industry practice",
          "Identify indicators on status of queen acceptance",
          "Check food sufficiency and demonstrates feeding of nucleus/starter colony",
          "Enumerate ways to maintain a newly established colony (ex. treat/applies corrective measures, checking food sufficiency and monitoring health and performance)",
          "Apply safety and health measures according to safety and health standards of industry",
        ],
      },
      {
        heading: "Conduct Harvesting Operation",
        title: "CONDUCT HARVESTING OPERATION",
        questions: [
          "Conduct preparatory activities of harvesting operations following industry practice",
          "Identify type of bee products to be harvested",
          "Demonstrate different harvesting procedures according to type of bee products, using appropriate tools/materials following industry practice",
          "Place harvested bee products in containers, observing food safety on handling products",
          "Place stickies and drawn combs inside the hive in preparation for the next harvest",
          "Clean and store harvesting tools and equipment",
          "Record amount of harvested products following industry procedure",
        ],
      },
      {
        heading: "Provide Pollination Services",
        title: "PROVIDE POLLINATION SERVICES",
        questions: [
          "Determine species of bees compatible to the crop to be pollinated according to industry practices",
          "Determine the number, location and types of colonies based on crop requirements for effective pollination",
          "Assess strength, condition and health of bee colonies that will be used for pollination services, according to industry practice",
          "Provide client with technical information (includes bee performance, health and safety of colony, protection against pesticide/pests) on bees following workplace procedure",
          "Discuss with client the details of services (including schedule, scope and coverage) that will be provided to reach an agreement",
          "Demonstrate packaging technique of colony to be transported, following industry standard",
          "Discuss required environmental/local government permits to be secured before transporting bee colonies",
          "Demonstrate how to sets up colonies according to industry procedure",
        ],
      },
    ],
  },
  "Caregiving NCII": {
    title: "Self-Assessment Guide - Caregiving NC II",
    sections: [
      {
        project: "Project 1",
        heading: "Provide Care and Support to Infants/Toddlers and Children",
        title: "PROVIDE CARE AND SUPPORT TO INFANTS/TODDLERS AND CHILDREN",
        questions: [
          "Provide care and support to infants/toddlers and children",
        ],
      },
      {
        project: "Project 1",
        heading: "Provide care and support to infants/toddlers and children",
        questions: [
          "Understand the characteristics of infants/toddlers",
          "Identify signs of hunger, distress and pain demonstrated by infants",
          "Establish bonding with infants and toddlers",
          "Perform proper hand washing techniques and procedures",
          "Perform procedures in bathing and dressing infants and toddlers",
          "Change infant diapers appropriately",
          "Prepare milk formula as prescribed",
          "Perform procedures in feeding and burping",
          "Provide activities to put infants and toddlers to rest and sleep",
          "Respond to physical, emotional, social, intellectual and creative needs of infants and toddlers",
        ],
      },
      {
        project: "Project 1",
        heading: "Provide care and support to children",
        questions: [
          "Teach hygiene practices to children",
          "Deal with bathroom/comfort room accidents in a manner that provide protection to the child’s esteem and privacy",
          "Dress up children according to weather condition and /or child’s culture/preferences",
          "Follow safe handling and maintenance of child’s school paraphernalia, toys and other personal things",
          "Perform the procedures in taking vital signs",
        ],
      },
      {
        project: "Project 1",
        heading: "Foster physical development of children",
        questions: [
          "Explain the physical growth and development of infant/toddler",
          "Determine types of activities that will foster physical development",
          "Organize indoor and outdoor recreational activities that enhance growth and motor skills development",
          "Understand the importance of rest and sleep for child’s growth",
          "Understand the social, intellectual, creative and emotional development of children",
        ],
      },
      {
        project: "Project 1",
        heading: "Foster social, intellectual, creative and emotional development of children",
        questions: [
          "Provide activities that will develop self-help skills and independence",
          "Provide opportunities for children to express their feelings, ideas and needs",
          "Enhance children’s awareness and creativity",
          "Foster positive discipline",
          "Respect individual differences of children",
        ],
      },
      {
        project: "Project 1",
        heading: "Respond to emergencies",
        questions: [
          "Perform CPR to infant/toddler",
          "Handle properly infant milk choking",
          "Respond to convulsion due to high fever",
        ],
      },
      {
        project: "Project 1",
        heading: "Prepare hot and cold meals",
        questions: [
          "Prepare foods suited to child’s age, health and cultural requirements",
          "Ensure freshness/quality of food serving",
        ],
      },
      {
        project: "Project 1",
        heading: "Maintain healthy and safe environment",
        questions: [
          "Determine environmental, health and safety standards",
          "Identify potential hazards indoor and outdoor",
          "Follow safety procedures and regulations",
        ],
      },
      {
        project: "Project 1",
        heading: "Establish Professionalism at The Workplace",
        questions: [
          "Observe and maintain personal hygiene and good grooming at all times",
          "Maintain cleanliness and orderliness of workplace",
          "Consider culture, customs and traditions of client",
        ],
      },
      {
        project: "Project 2",
        heading: "Provide Care and Support to Elderly and People with Special Needs",
        title: "PROVIDE CARE AND SUPPORT TO ELDERLY AND PEOPLE WITH SPECIAL NEEDS",
        questions: [
          "Provide care and services to elderly",
        ],
      },
      {
        project: "Project 2",
        heading: "Provide care and services to elderly",
        questions: [
          "Understand the characteristics of general aging process*",
          "Identify the physical and psychological needs of elderly*",
          "Use effective communication skills*",
          "Assist elderly in their personal needs*",
          "Assist elderly in performing daily activities*",
          "Maintain respect on right and preferences of the elderly client*",
          "Provide safety precautions in the environment*",
        ],
      },
      {
        project: "Project 2",
        heading: "Provide care and services to people with special needs",
        questions: [
          "Establish appropriate relationship to people with special needs*",
          "Understand the requirements of people with special needs*",
          "Assist people with special needs in meeting their requirements*",
          "Assist in maintaining an environment that enables people with special need to have maximum independent living*",
        ],
      },
      {
        project: "Project 2",
        heading: "Maintain healthy and safe environment",
        questions: [
          "Determine environmental, health and safe hazards*",
          "Maintain proper lighting, heating and cooling ventilation*",
          "Observe organizational policies and procedures for safety and environmental protection*",
          "Recognize symbols of hazardous materials ex. Flammable*",
        ],
      },
      {
        project: "Project 2",
        heading: "Respond to emergencies",
        questions: [
          "Observe universal rules of precaution for infection control*",
          "Use appropriate protection device for infection control*",
          "Recognize emergency sign and symptoms of illness (heart disease CVA, diabetes, etc)*",
          "Seek for medical assistance as necessary according to policies and procedure*",
          "Provide comfort and assurance*",
          "Identify first aid procedures*",
          "Perform adult CPR*",
        ],
      },
      {
        project: "Project 2",
        heading: "Prepare hot and cold meals",
        questions: [
          "Plan meals according to health and cultural preferences*",
          "Prepare and cooks ingredients according to recipe*",
          "Identify the uses and specifications of cooking tools and equipment*",
          "Perform basic table setting and servicing*",
          "Ensure freshness/quality of food served*",
          "Observe safety and maintenance of cooking tools and equipment*",
          "Observe personal hygiene and sanitation while cooking *",
        ],
      },
      {
        project: "Project 2",
        heading: "Establish professionalism in the workplace",
        questions: [
          "Exhibit willingness, enthusiasm and commitment to do the job*",
          "Assume full responsibility of work*",
          "Consider culture, customs and traditions of client*",
          "Observe positive work values and ethics*",
          "Maintain personal hygiene and good grooming at all times*",
          "Maintain professional relationship with client*",
        ],
      },
      {
        project: "Project 3",
        heading: "Perform Housekeeping Activities",
        title: "PERFORM HOUSEKEEPING ACTIVITIES",
        questions: [
          "Maintain healthy and safe environment",
        ],
      },
      {
        project: "Project 3",
        heading: "Maintain healthy and safe environment",
        questions: [
          "Use the appropriate cleaning tools and equipment*",
          "Determine environmental, health and safe hazard*",
          "Recognize symbols of hazardous materials (flammable, toxic)*",
          "Follow safety procedures and regulations*",
        ],
      },
      {
        project: "Project 3",
        heading: "Clean living, dining and bedroom, toilet and bathroom",
        questions: [
          "Apply suitable cleaning techniques and maintenance to different floor type and surface texture, ceilings and walls*",
          "Operate and maintains cleaning tools and equipment*",
          "Utilize appropriate cleaning materials and supplies*",
          "Dispose garbage and contaminated waste properly*",
          "Utilize proper sanitation techniques for infection control*",
          "Observe safety rules in cleaning*",
          "Arrange furnishings and fixtures for comfort, convenience and safety*",
          "Observe safety rules to prevent injury and damage to property*",
        ],
      },
      {
        project: "Project 3",
        heading: "Wash and iron clothes, linens and fabrics",
        questions: [
          "Perform techniques in sorting soiled clothes, linen and fabrics*",
          "Mend torn clothing, linen and fabric*",
          "Use appropriate chemical agents to remove stains*",
          "Observe safety precautions in the use of chemical agents*",
          "Perform laundry techniques and procedures*",
          "Operate clothes dryer according to manufacturer’s instructions*",
          "Provide maintenance for washing machine and clothes dryer*",
          "Perform the proper procedure and techniques in ironing*",
        ],
      },
      {
        project: "Project 3",
        heading: "Establish professionalism at the workplace",
        questions: [
          "Exhibit willingness and enthusiasm and commitment to do the job*",
          "Observe positive work values and ethics*",
          "Maintain integrity and high degree of proficiency in the work place*",
          "Observe and maintains personal hygiene and good grooming at all times*",
        ],
      },
      {
        project: "Project 3",
        heading: "LABEL:",
        questions: [
          "I agree to undertake assessment in the knowledge that information gathered will only be used for professional development purposes and can only be accessed by concerned assessment personnel and my manager/supervisor.",
        ],
      },
    ],
  },
  "Driving NCII": {
    title: "Self-Assessment Guide - Driving NC II",
    sections: [
      {
        heading: "Drive Light Vehicle",
        questions: [
          "Perform light vehicle pre starting and warm up",
          "Drive light vehicle",
        ],
      },
      {
        heading: "Carry Out Minor Vehicle Maintenance and Servicing",
        questions: [
          "Perform vehicle maintenance and minor servicing",
        ],
      },
      {
        heading: "Road Rules and Emergency Procedures",
        questions: [
          "Obey and observe traffic rules and regulation",
          "Practice road courtesy",
          "Implement and coordinate accident emergency procedures",
        ],
      },
    ],
  },
  "Bartending NCII": {
    title: "Self-Assessment Guide - Bartending NC II",
    sections: [
      {
        heading: "Clean Bar Areas",
        questions: [
          "Clean bar surface, tools and equipment",
          "Check working condition of equipments",
          "Check conditions of utensils and glassware for dirt and damages",
          "Remove empty and unwanted glasses on a regular basis with minimum disruption to customers",
          "Clean tables and service counter hygienically",
          "Perform bar cleaning procedures and workplace operations, safety and hygienic practices",
          "Use appropriate cleaning equipment and chemicals",
          "Dispose garbage properly",
        ],
      },
      {
        heading: "Operate Bar",
        questions: [
          "Set up the bar display and work area and re stock bar products and materials",
          "Identify and segregate bar products and materials",
          "Store all obtained items in accordance with established storing procedures and techniques",
          "Set up and segregate different glasses and bar tools",
          "Take and write down drink orders in order slip",
          "Perform proper pouring and serving of beer ordered drinks",
          "Use appropriate glassware and service accessories",
          "Minimize waste and spillage in preparing",
        ],
      },
      {
        heading: "Prepare and Mix Cocktails and Non-Alcoholic Concoctions / Provide Basic Wine Service",
        questions: [
          "Prepare and mix range of cocktails, alcoholic and non alcoholic drinks",
          "Apply appropriate mixing methods and procedures",
          "Use appropriate glass and service accessories",
          "Clean working area after mixing",
          "Observe sanitation, occupational health and safety practices",
          "Present wine list to customers",
          "Recommend appropriate wines for special occasions based on customers preference",
          "Answer customer queries about wines",
          "Demonstrate proper opening of wine",
          "Demonstrate proper pouring of wines to customers",
        ],
      },
    ],
  },
  "Agricultural Crops Production NCII": {
    title: "Self-Assessment Guide - Agricultural Crops Production NC II",
    sections: [
      {
        heading: "Perform Nursery Operations",
        questions: [
          "Prepare tools and simple equipment according work requirements",
          "Perform basic pre operative activities such as checking of tools",
          "Segregate and treat damaged and corroded tools according to maintenance plan and procedures",
          "Maintain nursery sanitation according to GAP standard",
          "Perform repair and maintenance of nursery facilities",
          "Determine seeds/planting materials according to kinds and varieties",
          "Select quality seeds according to prescribed characteristics",
          "Conduct seed testing to determine the percentage germination of the seed stock",
          "Perform seed treatment for germination purposes based on type of crop",
        ],
      },
      {
        heading: "Plant Crops and Care/Maintain Crops",
        questions: [
          "Prepare tools and equipment for land clearing",
          "Clear the land according to prescribed methods of land preparation",
          "Collect soil samples for analysis based on standard procedure",
          "Apply basal fertilizer based on crop requirement",
          "Perform digging of holes based on crop requirement",
          "Plant the seeds according to recommended rate, distance and depth",
          "Transplant the seedlings based on crop practices",
          "Monitor pest incidence based on prescribed procedure",
          "Control weed population",
          "Apply rate of fertilizer based on crop requirement",
          "Perform watering of crops following prescribed methods",
        ],
      },
      {
        heading: "Carry Out Harvest and Post-Harvest",
        questions: [
          "Identify crop maturity indicator",
          "Prepare materials, tools and equipment for harvesting and postharvest operations",
          "Compare pest and diseases in storage to reference manual",
          "Segregate harvested crop",
          "Collect data on the environment and other relevant information",
          "Maintain records and provides feedback",
          "Discuss labeling requirement for harvested produce",
        ],
      },
    ],
  },
};

const translations = {
  en: {
    language: "Form Language",
    title: "Application for Competency Assessment",
    breadcrumbForm: "Application Form",
    breadcrumbCurrent: "Competency Assessment",
    stepCount: "Step",
    of: "of",
    saveDraft: "Save Draft",
    back: "Back",
    next: "Next",
    finish: "Finish",
    addEntry: "Add entry",
    removeEntry: "Remove",
    mobileReminder:
      "Reminder: This portal is for data encoding. Physical submission at Eastern Samar Provincial Office is mandatory.",
    steps: ["Assessment", "Profile", "Experience", "Training", "Credentials", "Self-Assessment", "Summary"],
    stepDescriptions: [
      "School, assessment title, assessment type, and client category.",
      "Personal details, address, contact information, education, and employment.",
      "National Qualification-related work history.",
      "National Qualification-related trainings and seminars.",
      "Licensure, competency certificates, and other supporting information.",
      "Self-assessment guide based on selected assessment title.",
      "Review and compile your application before submission.",
    ],
    sections: {
      assessmentDetails: "Assessment Details",
      clientType: "Client Type",
      profile: "Profile",
      workExperience: "Work Experience",
      training: "Other Training / Seminars Attended",
      licensure: "Licensure Examination(s) Passed",
      competency: "Competency Assessment(s) Passed",
      selfAssessmentGuide: "Self-Assessment Guide",
      previewSummary: "Summary",
    },
    labels: {
      school: "Name of School / Training Center / Company",
      address: "Address",
      assessmentTitle: "Title of Assessment Applied For",
      assessmentType: "Assessment Type",
      surname: "Surname",
      firstName: "First Name",
      middleName: "Middle Name",
      middleInitial: "Middle Initial",
      nameExtension: "Name Extension",
      mailingAddress: "Mailing Address",
      motherName: "Mother's Name",
      fatherName: "Father's Name",
      sex: "Sex",
      civilStatus: "Civil Status",
      telephone: "Telephone Number",
      mobile: "Mobile Number",
      email: "Email Address",
      fax: "Fax",
      education: "Highest Educational Attainment",
      employment: "Employment Status",
      birthDate: "Birth Date",
      birthPlace: "Birth Place",
      age: "Age",
      selfAssessmentAdvice: "Answer each item with Yes or No based on your current competency.",
      selfAssessmentNoSelection: "Select a title of assessment in Step 1 to load the guide.",
      yes: "Yes",
      no: "No",
      previewNote: "Please review your encoded data. Clicking Finish will save your compiled PDFs and redirect to My Application.",
      previewFormInfo: "Form Information",
      previewSAGResponses: "Self-Assessment Responses",
      previewNoData: "No data captured yet.",
    },
    placeholders: {
      nameExtension: "e.g. Jr., Sr.",
      street: "Number, Street",
      barangay: "Barangay",
      district: "District",
      city: "City",
      province: "Province",
      region: "Region",
      zipCode: "Zip Code",
    },
    options: {
      assessmentTitles: [
        "Beekeeping",
        "Caregiving NCII",
        "Driving NCII",
        "Bartending NCII",
        "Agricultural Crops Production NCII",
      ],
      assessmentTypes: ["Full Qualification", "COC", "Renewal"],
      clientTypes: [
        "TVET Graduating Student",
        "TVET Graduate",
        "Industry Worker",
        "K-12",
        "OFW",
      ],
      sex: ["Male", "Female"],
      civilStatus: ["Single", "Married", "Widow/er", "Separated", "Others"],
      education: [
        "Elementary Graduate",
        "High School Graduate",
        "TVET Graduate",
        "College Level",
        "College Graduate",
        "Others",
      ],
      employment: [
        "Casual",
        "Job Order",
        "Probationary",
        "Permanent",
        "Self-Employed",
        "OFW",
      ],
    },
    tableNotes: {
      workExperience: "National Qualification-related experience.",
      training: "National Qualification-related training.",
    },
    tableColumns: {
      workExperience: [
        "Name of Company",
        "Position",
        "Inclusive Dates",
        "Monthly Salary",
        "Status of Appointment",
        "No. of Yrs. Working Exp.",
      ],
      training: ["Title", "Venue", "Inclusive Dates", "No. of Hours", "Conducted By"],
      licensure: ["Title", "Year Taken", "Examination Venue", "Rating", "Remarks", "Expiry Date"],
      competency: [
        "Title",
        "Qualification Level",
        "Industry Sector",
        "Certificate Number",
        "Date of Issuance",
        "Expiration Date",
      ],
    },
  },
  tl: {
    language: "Wika ng Form",
    title: "Aplikasyon para sa Competency Assessment",
    breadcrumbForm: "Application Form",
    breadcrumbCurrent: "Competency Assessment",
    stepCount: "Hakbang",
    of: "ng",
    saveDraft: "I-save ang Draft",
    back: "Bumalik",
    next: "Susunod",
    finish: "Tapusin",
    addEntry: "Magdagdag ng entry",
    removeEntry: "Tanggalin",
    mobileReminder:
      "Paalala: Ang portal na ito ay para sa pag-encode ng datos. Kailangang isumite pa rin nang personal sa TESDA Eastern Samar Provincial Office.",
    steps: ["Assessment", "Profile", "Karanasan", "Pagsasanay", "Kredensyal", "Self-Assessment", "Summary"],
    stepDescriptions: [
      "Paaralan o training center, assessment na ina-applyan, uri ng assessment, at client type.",
      "Personal na detalye, tirahan, contact information, edukasyon, at trabaho.",
      "Karanasan sa trabaho na may kaugnayan sa National Qualification.",
      "Mga training at seminar na may kaugnayan sa National Qualification.",
      "Licensure, competency certificates, at iba pang karagdagang impormasyon.",
      "Self-assessment guide batay sa napiling assessment title.",
      "I-review at i-compile ang application bago isumite.",
    ],
    sections: {
      assessmentDetails: "Detalye ng Assessment",
      clientType: "Uri ng Kliyente",
      profile: "Profile",
      workExperience: "Karanasan sa Trabaho",
      training: "Ibang Training / Seminar na Nadaluhan",
      licensure: "Naipasang Licensure Examination",
      competency: "Naipasang Competency Assessment",
      selfAssessmentGuide: "Self-Assessment Guide",
      previewSummary: "Summary",
    },
    labels: {
      school: "Pangalan ng Paaralan / Training Center / Kumpanya",
      address: "Address",
      assessmentTitle: "Pamagat ng Assessment na Ina-applyan",
      assessmentType: "Uri ng Assessment",
      surname: "Apelyido",
      firstName: "Pangalan",
      middleName: "Gitnang Pangalan",
      middleInitial: "Middle Initial",
      nameExtension: "Name Extension",
      mailingAddress: "Mailing Address",
      motherName: "Pangalan ng Ina",
      fatherName: "Pangalan ng Ama",
      sex: "Kasarian",
      civilStatus: "Civil Status",
      telephone: "Telephone Number",
      mobile: "Mobile Number",
      email: "Email Address",
      fax: "Fax",
      education: "Pinakamataas na Natapos",
      employment: "Employment Status",
      birthDate: "Petsa ng Kapanganakan",
      birthPlace: "Lugar ng Kapanganakan",
      age: "Edad",
      selfAssessmentAdvice: "Sagutan ang bawat item ng Yes o No ayon sa iyong kasalukuyang kakayahan.",
      selfAssessmentNoSelection: "Pumili muna ng title of assessment sa Step 1 para lumabas ang guide.",
      yes: "Yes",
      no: "No",
      previewNote: "I-review ang na-encode na data. Kapag pinindot ang Finish, mase-save ang compiled PDFs at ire-redirect sa My Application.",
      previewFormInfo: "Impormasyon ng Form",
      previewSAGResponses: "Mga Sagot sa Self-Assessment",
      previewNoData: "Wala pang naka-capture na data.",
    },
    placeholders: {
      nameExtension: "hal. Jr., Sr.",
      street: "Numero, Kalye",
      barangay: "Barangay",
      district: "Distrito",
      city: "Lungsod / Bayan",
      province: "Probinsya",
      region: "Rehiyon",
      zipCode: "Zip Code",
    },
    options: {
      assessmentTitles: [
        "Beekeeping",
        "Caregiving NCII",
        "Driving NCII",
        "Bartending NCII",
        "Agricultural Crops Production NCII",
      ],
      assessmentTypes: ["Full Qualification", "COC", "Renewal"],
      clientTypes: [
        "TVET Graduating Student",
        "TVET Graduate",
        "Industry Worker",
        "K-12",
        "OFW",
      ],
      sex: ["Lalaki", "Babae"],
      civilStatus: ["Single", "May Asawa", "Biyudo/Biyuda", "Hiwalay", "Iba pa"],
      education: [
        "Elementary Graduate",
        "High School Graduate",
        "TVET Graduate",
        "College Level",
        "College Graduate",
        "Iba pa",
      ],
      employment: [
        "Casual",
        "Job Order",
        "Probationary",
        "Permanent",
        "Self-Employed",
        "OFW",
      ],
    },
    tableNotes: {
      workExperience: "Karanasan na may kaugnayan sa National Qualification.",
      training: "Training na may kaugnayan sa National Qualification.",
    },
    tableColumns: {
      workExperience: [
        "Pangalan ng Kumpanya",
        "Posisyon",
        "Inclusive Dates",
        "Buwanang Sahod",
        "Status of Appointment",
        "Bilang ng Taon ng Karanasan",
      ],
      training: ["Pamagat", "Lugar", "Inclusive Dates", "Bilang ng Oras", "Conducted By"],
      licensure: ["Pamagat", "Taon Kinuha", "Lugar ng Exam", "Rating", "Remarks", "Expiry Date"],
      competency: [
        "Pamagat",
        "Qualification Level",
        "Industry Sector",
        "Certificate Number",
        "Petsa ng Pag-isyu",
        "Expiration Date",
      ],
    },
  },
} as const;

function Field({
  label,
  children,
}: Readonly<{
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-semibold text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}

function TextInput({
  name,
  placeholder,
  type = "text",
  value,
  readOnly = false,
  onChange,
}: Readonly<{
  name?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  readOnly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}>) {
  const shouldUppercase = type === "text";

  return (
    <input
      className="min-h-11 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-base leading-6 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
      name={name}
      onChange={onChange}
      onInput={
        shouldUppercase && !readOnly
          ? (event) => {
              event.currentTarget.value = event.currentTarget.value.toUpperCase();
            }
          : undefined
      }
      placeholder={placeholder}
      readOnly={readOnly}
      style={shouldUppercase ? { textTransform: "uppercase" } : undefined}
      type={type}
      value={value}
    />
  );
}

function SelectInput({
  name,
  options,
  value,
  onChange,
}: Readonly<{
  name: string;
  options: readonly string[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}>) {
  return (
    <select
      className="min-h-11 w-full appearance-none rounded-lg border border-outline-variant bg-white px-3 py-2.5 pr-10 text-base leading-6 text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25"
      name={name}
      onChange={onChange}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M6 8l4 4 4-4' stroke='%23334155' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.75rem center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "1rem 1rem",
      }}
      value={value}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function RadioOption({
  className = "",
  label,
  name,
}: Readonly<{
  className?: string;
  label: string;
  name: string;
}>) {
  return (
    <label
      className={`flex min-h-10 items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 ${className}`}
    >
      <input className="accent-primary" name={name} type="radio" value={label} />
      <span className="text-sm leading-5 text-on-surface">{label}</span>
    </label>
  );
}

function OptionGroup({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function FormSection({
  icon,
  title,
  children,
}: Readonly<{
  icon: typeof faUser;
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
        <FontAwesomeIcon aria-hidden="true" className="h-5 w-5 text-primary" icon={icon} />
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FieldGroup({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <div className={`border-t border-slate-200 pt-6 ${className}`}>{children}</div>;
}

function EntryGroups({
  addLabel,
  count,
  fields,
  onAdd,
  onRemove,
  removeLabel,
  name,
}: Readonly<{
  addLabel: string;
  count: number;
  fields: readonly string[];
  onAdd: () => void;
  onRemove: () => void;
  removeLabel: string;
  name: string;
}>) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, entryIndex) => (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={entryIndex}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase text-secondary">
              Entry {entryIndex + 1}
            </p>
            {entryIndex > 0 && entryIndex === count - 1 ? (
              <button
                className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-error"
                onClick={onRemove}
                type="button"
              >
                {removeLabel}
              </button>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fields.map((field, fieldIndex) => (
              <Field label={field} key={field}>
                <TextInput
                  name={`${name}_${entryIndex}_${fieldIndex}`}
                  type={field.toLowerCase().includes("date") ? "date" : "text"}
                />
              </Field>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-blue-50 sm:w-auto"
          onClick={onAdd}
          type="button"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}
export function ApplicationFormClient() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [shouldDownloadPdf, setShouldDownloadPdf] = useState(false);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [previewSections, setPreviewSections] = useState<
    Array<{ rows: Array<{ label: string; value: string }>; title: string }>
  >([]);
  const [language, setLanguage] = useState<FormLanguage>("en");
  const [entryCounts, setEntryCounts] = useState({
    competency: 1,
    licensure: 1,
    training: 1,
    workExperience: 1,
  });
  const t = translations[language];
  const selectedSelfAssessmentGuide =
    assessmentTitle.length > 0
      ? extractedSelfAssessmentGuides[assessmentTitle as keyof typeof extractedSelfAssessmentGuides] ??
        selfAssessmentGuides[assessmentTitle as keyof typeof selfAssessmentGuides]
      : undefined;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === t.steps.length - 1;

  function toLabel(name: string) {
    return name
      .replace(/^sag_/, "SAG ")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function refreshPreview() {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const values = collectFormValues(form);
    const profileRows = Object.entries(values)
      .filter(([key, value]) => !key.startsWith("sag_") && value.trim().length > 0)
      .map(([key, value]) => ({
        label: toLabel(key),
        value,
      }));

    const sagRows =
      selectedSelfAssessmentGuide?.sections.flatMap((section, sectionIndex) =>
        section.questions.map((question, questionIndex) => {
          const answerKey = `sag_${sectionIndex}_${questionIndex}`;
          return {
            label: question,
            value: values[answerKey] || "NO ANSWER",
          };
        }),
      ) ?? [];

    setPreviewSections([
      {
        rows: profileRows,
        title: t.labels.previewFormInfo,
      },
      {
        rows: sagRows,
        title: t.labels.previewSAGResponses,
      },
    ]);
  }

  useEffect(() => {
    if (activeStep === 6) {
      refreshPreview();
    }
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  function goToPreviousStep() {
    setShouldDownloadPdf(false);
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function goToNextStep() {
    setShouldDownloadPdf(false);
    setActiveStep((current) => Math.min(current + 1, t.steps.length - 1));
  }

  function addEntry(section: keyof typeof entryCounts) {
    setEntryCounts((current) => ({
      ...current,
      [section]: current[section] + 1,
    }));
  }

  function removeEntry(section: keyof typeof entryCounts) {
    setEntryCounts((current) => ({
      ...current,
      [section]: Math.max(current[section] - 1, 1),
    }));
  }

  async function blobToDataUrl(blob: Blob) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to encode PDF blob."));
      reader.onloadend = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLastStep || !shouldDownloadPdf) {
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const form = event.currentTarget;
      const values = collectFormValues(form);
      const middleInitial = (values.middle_initial ?? values.middle_name ?? "").trim();
      const formattedApplicantName = [
        values.surname?.trim(),
        [values.first_name?.trim(), middleInitial ? `${middleInitial.charAt(0)}.` : ""].filter(Boolean).join(" "),
      ]
        .filter(Boolean)
        .join(", ");
      const fullName = formattedApplicantName || [values.surname, values.first_name, values.middle_name].filter(Boolean).join(", ");
      const sagResponses =
        selectedSelfAssessmentGuide?.sections.flatMap((section, sectionIndex) =>
          section.questions.map((question, questionIndex) => {
            const responseKey = `sag_${sectionIndex}_${questionIndex}`;
            const answer = (values[responseKey] ?? "NO ANSWER").toUpperCase();
            return {
              answer,
              question,
              section: section.title ?? section.heading,
            };
          }),
        ) ?? [];

      const [applicationBlob, sagBlob, consentBlob] = await Promise.all([
        generateFilledApplicationPdfBlob(form),
        generateSAGCompilationPdfBlob({
          assessmentTitle,
          responses: sagResponses,
        }),
        generateConsentFormPdfBlob({
          applicantName: fullName || "N/A",
        }),
      ]);

      const [applicationDataUrl, sagDataUrl, consentDataUrl] = await Promise.all([
        blobToDataUrl(applicationBlob),
        blobToDataUrl(sagBlob),
        blobToDataUrl(consentBlob),
      ]);

      const newBatch = {
        applicationForm: applicationDataUrl,
        assessmentTitle: assessmentTitle || "N/A",
        consentForm: consentDataUrl,
        id: `batch-${Date.now()}`,
        applicantName: formattedApplicantName || "N/A",
        sagForm: sagDataUrl,
        submittedAt: new Date().toISOString(),
      };

      const rawExisting = localStorage.getItem(MY_APPLICATION_BATCHES_KEY);
      const existingBatches = rawExisting ? (JSON.parse(rawExisting) as unknown[]) : [];
      localStorage.setItem(MY_APPLICATION_BATCHES_KEY, JSON.stringify([newBatch, ...existingBatches]));
      router.push("/applicant/my-application");
    } finally {
      setShouldDownloadPdf(false);
      setIsGeneratingPdf(false);
    }
  }

  return (
    <>
      <section className="space-y-5">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-secondary">
            <ol className="flex flex-wrap items-center gap-2">
              <li>{t.breadcrumbForm}</li>
              <li>
                <FontAwesomeIcon aria-hidden="true" className="h-3 w-3" icon={faChevronRight} />
              </li>
              <li className="font-semibold text-primary">{t.breadcrumbCurrent}</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight text-primary">{t.title}</h1>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold uppercase text-secondary">
                {t.stepCount} {activeStep + 1} {t.of} {t.steps.length}
              </p>
              <p className="max-w-3xl text-sm leading-6 text-secondary">{t.stepDescriptions[activeStep]}</p>
            </div>
            </div>
            <div className="flex w-fit shrink-0 items-center rounded-lg border border-outline-variant bg-white p-1">
              <span className="px-3 text-sm font-semibold text-secondary">{t.language}</span>
              <button
                className={
                  language === "en"
                    ? "min-h-10 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                    : "min-h-10 rounded-md px-3 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
                }
                onClick={() => setLanguage("en")}
                type="button"
              >
                English
              </button>
              <button
                className={
                  language === "tl"
                    ? "min-h-10 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                    : "min-h-10 rounded-md px-3 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
                }
                onClick={() => setLanguage("tl")}
                type="button"
              >
                Tagalog
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="relative flex min-w-3xl items-start justify-between gap-5">
            <div className="absolute left-5 right-5 top-5 -z-0 h-px bg-slate-200" />
            {t.steps.map((step, index) => {
              const isActive = index === activeStep;
              const isComplete = index < activeStep;

              return (
                <div className="relative z-10 flex min-w-24 flex-col items-center gap-2" key={step}>
                  <button
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Go to ${step}`}
                    className={
                      isActive
                        ? "flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-white shadow-md"
                        : isComplete
                          ? "flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-white font-bold text-primary transition-colors hover:bg-blue-50"
                          : "flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white font-bold text-slate-400 transition-colors hover:border-primary/50 hover:text-primary"
                    }
                    onClick={() => setActiveStep(index)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                  <button
                    className={
                      isActive || isComplete
                        ? "min-h-11 text-center text-sm font-semibold text-primary"
                        : "min-h-11 text-center text-sm font-semibold text-slate-400 transition-colors hover:text-primary"
                    }
                    onClick={() => setActiveStep(index)}
                    type="button"
                  >
                    {step}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <form className="space-y-10" onSubmit={handleSubmit} ref={formRef}>
          <div className={activeStep === 0 ? "space-y-10" : "hidden"}>
              <FormSection icon={faClipboardCheck} title={t.sections.assessmentDetails}>
                <div className="grid gap-5 pt-2 md:grid-cols-2">
                  <Field label={t.labels.school}>
                    <TextInput name="school" />
                  </Field>
                  <Field label={t.labels.address}>
                    <TextInput name="school_address" />
                  </Field>
                  <Field label={t.labels.assessmentTitle}>
                    <SelectInput
                      name="assessment_title"
                      onChange={(event) => setAssessmentTitle(event.currentTarget.value)}
                      options={t.options.assessmentTitles}
                      value={assessmentTitle}
                    />
                  </Field>
                  <div className="space-y-2">
                    <span className="block text-sm font-semibold text-on-surface-variant">
                      {t.labels.assessmentType}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {t.options.assessmentTypes.map((assessmentType) => (
                        <RadioOption
                          className={
                            assessmentType === "Full Qualification"
                              ? "min-w-44 flex-[1.5_1_11rem]"
                              : assessmentType === "COC"
                                ? "min-w-20 flex-[0.6_1_5rem]"
                                : "min-w-28 flex-1"
                          }
                          key={assessmentType}
                          label={assessmentType}
                          name="assessment_type"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection icon={faIdCard} title={t.sections.clientType}>
                <OptionGroup>
                  {t.options.clientTypes.map((clientType) => (
                    <RadioOption key={clientType} label={clientType} name="client_type" />
                  ))}
                </OptionGroup>
              </FormSection>
          </div>

          <div className={activeStep === 1 ? "space-y-10" : "hidden"}>
            <FormSection icon={faUser} title={t.sections.profile}>
              <div className="grid gap-5 md:grid-cols-3">
                <Field label={t.labels.surname}>
                  <TextInput name="surname" />
                </Field>
                <Field label={t.labels.firstName}>
                  <TextInput name="first_name" />
                </Field>
                <Field label={t.labels.middleName}>
                  <TextInput
                    name="middle_name"
                    onChange={(event) => {
                      const initialField = formRef.current?.elements.namedItem("middle_initial") as
                        | HTMLInputElement
                        | null;
                      if (!initialField) {
                        return;
                      }
                      const middleName = event.currentTarget.value.trim();
                      initialField.value = middleName ? middleName.charAt(0).toUpperCase() : "";
                    }}
                  />
                </Field>
                <Field label={t.labels.middleInitial}>
                  <TextInput name="middle_initial" readOnly />
                </Field>
                <Field label={t.labels.nameExtension}>
                  <TextInput name="name_extension" placeholder={t.placeholders.nameExtension} />
                </Field>
              </div>

              <div className="mt-6 space-y-7">
                <FieldGroup className="border-t-0 pt-0">
                  <Field label={t.labels.mailingAddress}>
                  <div className="grid gap-4 md:grid-cols-3">
                    <TextInput name="street" placeholder={t.placeholders.street} />
                    <TextInput name="barangay" placeholder={t.placeholders.barangay} />
                    <TextInput name="district" placeholder={t.placeholders.district} />
                    <TextInput name="city" placeholder={t.placeholders.city} />
                    <TextInput name="province" placeholder={t.placeholders.province} />
                    <TextInput name="region" placeholder={t.placeholders.region} />
                    <TextInput name="zip_code" placeholder={t.placeholders.zipCode} />
                  </div>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={t.labels.motherName}>
                      <TextInput name="mother_name" />
                    </Field>
                    <Field label={t.labels.fatherName}>
                      <TextInput name="father_name" />
                    </Field>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">{t.labels.sex}</span>
                      <OptionGroup>
                        {t.options.sex.map((sex) => (
                          <RadioOption key={sex} label={sex} name="sex" />
                        ))}
                      </OptionGroup>
                    </div>
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">
                        {t.labels.civilStatus}
                      </span>
                      <OptionGroup>
                        {t.options.civilStatus.map((status) => (
                          <RadioOption key={status} label={status} name="civil_status" />
                        ))}
                      </OptionGroup>
                    </div>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <Field label={t.labels.telephone}>
                      <TextInput name="telephone" type="tel" />
                    </Field>
                    <Field label={t.labels.mobile}>
                      <TextInput name="mobile" type="tel" />
                    </Field>
                    <Field label={t.labels.email}>
                      <TextInput name="email" type="email" />
                    </Field>
                    <Field label={t.labels.fax}>
                      <TextInput name="fax" />
                    </Field>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">
                        {t.labels.education}
                      </span>
                      <OptionGroup>
                        {t.options.education.map((education) => (
                          <RadioOption key={education} label={education} name="education" />
                        ))}
                      </OptionGroup>
                    </div>
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">
                        {t.labels.employment}
                      </span>
                      <OptionGroup>
                        {t.options.employment.map((status) => (
                          <RadioOption key={status} label={status} name="employment_status" />
                        ))}
                      </OptionGroup>
                    </div>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_8rem]">
                    <Field label={t.labels.birthDate}>
                      <TextInput name="birth_date" type="date" />
                    </Field>
                    <Field label={t.labels.birthPlace}>
                      <TextInput name="birth_place" />
                    </Field>
                    <Field label={t.labels.age}>
                      <TextInput name="age" type="number" />
                    </Field>
                  </div>
                </FieldGroup>
              </div>
            </FormSection>
          </div>

          <div className={activeStep === 2 ? "space-y-10" : "hidden"}>
            <FormSection icon={faBriefcase} title={t.sections.workExperience}>
              <p className="mb-4 text-sm leading-6 text-secondary">{t.tableNotes.workExperience}</p>
              <EntryGroups
                addLabel={t.addEntry}
                count={entryCounts.workExperience}
                fields={t.tableColumns.workExperience}
                onAdd={() => addEntry("workExperience")}
                onRemove={() => removeEntry("workExperience")}
                removeLabel={t.removeEntry}
                name="work_experience"
              />
            </FormSection>
          </div>

          <div className={activeStep === 3 ? "space-y-10" : "hidden"}>
            <FormSection icon={faGraduationCap} title={t.sections.training}>
              <p className="mb-4 text-sm leading-6 text-secondary">{t.tableNotes.training}</p>
              <EntryGroups
                addLabel={t.addEntry}
                count={entryCounts.training}
                fields={t.tableColumns.training}
                onAdd={() => addEntry("training")}
                onRemove={() => removeEntry("training")}
                removeLabel={t.removeEntry}
                name="training"
              />
            </FormSection>
          </div>

          <div className={activeStep === 4 ? "space-y-10" : "hidden"}>
              <FormSection icon={faCertificate} title={t.sections.licensure}>
                <EntryGroups
                  addLabel={t.addEntry}
                  count={entryCounts.licensure}
                  fields={t.tableColumns.licensure}
                  onAdd={() => addEntry("licensure")}
                  onRemove={() => removeEntry("licensure")}
                  removeLabel={t.removeEntry}
                  name="licensure"
                />
              </FormSection>

              <FormSection icon={faCertificate} title={t.sections.competency}>
                <EntryGroups
                  addLabel={t.addEntry}
                  count={entryCounts.competency}
                  fields={t.tableColumns.competency}
                  onAdd={() => addEntry("competency")}
                  onRemove={() => removeEntry("competency")}
                  removeLabel={t.removeEntry}
                  name="competency"
                />
              </FormSection>

          </div>

          <div className={activeStep === 5 ? "space-y-10" : "hidden"}>
            <FormSection icon={faClipboardCheck} title={t.sections.selfAssessmentGuide}>
              <p className="mb-4 text-sm leading-6 text-secondary">{t.labels.selfAssessmentAdvice}</p>
              {selectedSelfAssessmentGuide ? (
                <div className="space-y-6">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <h3 className="text-base font-semibold text-primary">{selectedSelfAssessmentGuide.title}</h3>
                  </div>
                  {selectedSelfAssessmentGuide.sections.map((section, sectionIndex) => (
                    <div
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      key={`${section.project ?? "no-project"}-${section.heading}-${sectionIndex}`}
                    >
                      {section.project ? (
                        <p className="mb-2 text-sm font-bold text-primary">
                          {section.project}: {section.heading}
                        </p>
                      ) : null}
                      <h4 className="mb-4 text-sm font-bold text-secondary">
                        {section.title ?? section.heading}
                      </h4>
                      <div className="space-y-4">
                        {section.questions.map((question, questionIndex) => (
                          <div
                            className="rounded-lg border border-slate-200 bg-white p-4"
                            key={`${section.project ?? "no-project"}-${section.heading}-${questionIndex}`}
                          >
                            <p className="text-sm leading-6 text-on-surface">{question}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <RadioOption
                                className="min-w-24"
                                label={t.labels.yes}
                                name={`sag_${sectionIndex}_${questionIndex}`}
                              />
                              <RadioOption
                                className="min-w-24"
                                label={t.labels.no}
                                name={`sag_${sectionIndex}_${questionIndex}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {t.labels.selfAssessmentNoSelection}
                </div>
              )}
            </FormSection>
          </div>

          <div className={activeStep === 6 ? "space-y-10" : "hidden"}>
            <FormSection icon={faClipboardCheck} title={t.sections.previewSummary}>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm leading-6 text-secondary">{t.labels.previewNote}</p>
                <div className="max-h-[28rem] space-y-5 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4">
                  {previewSections.map((section) => (
                    <div className="space-y-3" key={section.title}>
                      <h4 className="text-sm font-bold text-primary">{section.title}</h4>
                      {section.rows.length > 0 ? (
                        <div className="space-y-2">
                          {section.rows.map((row, index) => (
                            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2" key={`${section.title}-${index}`}>
                              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{row.label}</p>
                              <p className="text-sm text-on-surface">{row.value}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-secondary">{t.labels.previewNoData}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 md:flex-row md:items-center md:justify-between">
            <button
              className="order-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 md:order-1 md:w-auto"
              type="button"
            >
              <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faSave} />
              {t.saveDraft}
            </button>

            <div className="order-1 flex w-full flex-col gap-4 md:order-2 md:w-auto md:flex-row">
              <button
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                disabled={isFirstStep}
                onClick={goToPreviousStep}
                type="button"
              >
                {t.back}
              </button>
              {isLastStep ? (
                <button
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-container md:w-auto"
                  disabled={isGeneratingPdf}
                  onClick={() => setShouldDownloadPdf(true)}
                  type="submit"
                >
                  <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faPrint} />
                  {isGeneratingPdf ? "Generating..." : t.finish}
                </button>
              ) : (
                <button
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-container md:w-auto"
                  onClick={goToNextStep}
                  type="button"
                >
                  {t.next}
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4 lg:hidden">
        <p className="text-center text-sm leading-6 text-blue-800">
          {t.mobileReminder}
        </p>
      </section>
    </>
  );
}
