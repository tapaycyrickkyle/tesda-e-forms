import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";

type PdfFormValues = Record<string, string>;

const pdfPath = "/forms/application-form.pdf";
const consentPdfPath = "/forms/consent-form.pdf";
const PROFILE_CALIBRATION_MODE = false;

const PROFILE_NAME_GRID = {
  cellWidth: 11.125,
  gridX: 64,
  rows: {
    surname: { startColumn: 1, y: 367 },
    firstName: { startColumn: 3, y: 349 },
    middleName: { startColumn: 2, y: 332 },
  },
} as const;

function formText(values: PdfFormValues, name: string) {
  return values[name]?.trim().toUpperCase() ?? "";
}

function isSelected(value: string, option: string) {
  return value === option.toUpperCase();
}

export function collectFormValues(form: HTMLFormElement) {
  const formData = new FormData(form);
  const values: PdfFormValues = {};

  for (const [key, value] of formData.entries()) {
    values[key] = String(value);
  }

  return values;
}

function toPdfBlob(pdfBytes: Uint8Array) {
  const pdfBuffer = new ArrayBuffer(pdfBytes.length);
  new Uint8Array(pdfBuffer).set(pdfBytes);
  return new Blob([pdfBuffer], { type: "application/pdf" });
}

function drawValue({
  font,
  maxWidth = 150,
  page,
  size = 8,
  value,
  x,
  y,
}: {
  font: PDFFont;
  maxWidth?: number;
  page: PDFPage;
  size?: number;
  value: string;
  x: number;
  y: number;
}) {
  if (!value) {
    return;
  }

  page.drawText(value, {
    color: rgb(0, 0, 0),
    font,
    maxWidth,
    size,
    x,
    y,
  });
}

function drawCheck({
  checked,
  font,
  page,
  x,
  y,
}: {
  checked: boolean;
  font: PDFFont;
  page: PDFPage;
  x: number;
  y: number;
}) {
  if (!checked) {
    return;
  }

  page.drawText("X", {
    color: rgb(0, 0, 0),
    font,
    size: 8,
    x,
    y,
  });
}

function drawBoxedText({
  cellWidth,
  gridX,
  startColumn = 0,
  font,
  maxCharacters = 16,
  page,
  size = 7,
  value,
  x,
  y,
}: {
  cellWidth: number;
  font: PDFFont;
  gridX?: number;
  maxCharacters?: number;
  page: PDFPage;
  size?: number;
  startColumn?: number;
  value: string;
  x: number;
  y: number;
}) {
  const characters = value
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase()
    .slice(0, maxCharacters)
    .split("");
  const baseX = gridX ?? x;

  characters.forEach((character, index) => {
    if (character === " ") {
      return;
    }

    const columnIndex = startColumn + index;
    const charWidth = font.widthOfTextAtSize(character, size);
    const centeredX = baseX + columnIndex * cellWidth + (cellWidth - charWidth) / 2;

    page.drawText(character, {
      color: rgb(0, 0, 0),
      font,
      size,
      x: centeredX,
      y,
    });
  });
}

function drawTableRow({
  font,
  page,
  prefix,
  values,
  y,
  columns,
}: {
  columns: Array<{ maxWidth: number; x: number }>;
  font: PDFFont;
  page: PDFPage;
  prefix: string;
  values: PdfFormValues;
  y: number;
}) {
  columns.forEach((column, index) => {
    drawValue({
      font,
      maxWidth: column.maxWidth,
      page,
      size: 6,
      value: formText(values, `${prefix}_${index}`),
      x: column.x,
      y,
    });
  });
}

function drawProfileCalibrationGuides({
  font,
  page,
  profileGridX,
  profileCellWidth,
  rowY,
  startColumn,
  label,
  cellCount = 10,
}: {
  cellCount?: number;
  font: PDFFont;
  label: string;
  page: PDFPage;
  profileGridX: number;
  profileCellWidth: number;
  rowY: number;
  startColumn: number;
}) {
  const markerX = profileGridX + startColumn * profileCellWidth;
  for (let index = 0; index < cellCount; index += 1) {
    page.drawRectangle({
      borderColor: rgb(1, 0, 0),
      borderWidth: index === 0 ? 1.2 : 0.7,
      height: 16,
      width: profileCellWidth,
      x: markerX + index * profileCellWidth,
      y: rowY - 4,
    });
  }
  page.drawRectangle({
    borderColor: rgb(1, 0, 0),
    borderWidth: 1,
    height: 16,
    width: profileCellWidth,
    x: markerX,
    y: rowY - 4,
  });
  page.drawText(label, {
    color: rgb(1, 0, 0),
    font,
    size: 7,
    x: markerX + 3,
    y: rowY + 7,
  });
}

function drawFirstPage(page: PDFPage, font: PDFFont, values: PdfFormValues) {
  const profileGridX = PROFILE_NAME_GRID.gridX;
  const profileCellWidth = PROFILE_NAME_GRID.cellWidth;

  drawValue({
    font,
    maxWidth: 350,
    page,
    value: formText(values, "school"),
    x: 220,
    y: 499,
  });
  drawValue({
    font,
    maxWidth: 480,
    page,
    value: formText(values, "school_address"),
    x: 62,
    y: 479,
  });
  drawValue({
    font,
    maxWidth: 380,
    page,
    value: formText(values, "assessment_title"),
    x: 169,
    y: 461,
  });

  const assessmentType = formText(values, "assessment_type");
  drawCheck({ checked: isSelected(assessmentType, "Full Qualification"), font, page, x: 64, y: 445 });
  drawCheck({ checked: isSelected(assessmentType, "COC"), font, page, x: 262, y: 445 });
  drawCheck({ checked: isSelected(assessmentType, "Renewal"), font, page, x: 441, y: 445 });

  const clientType = formText(values, "client_type");
  drawCheck({ checked: isSelected(clientType, "TVET Graduating Student"), font, page, x: 16, y: 418 });
  drawCheck({ checked: isSelected(clientType, "TVET Graduate"), font, page, x: 147, y: 418 });
  drawCheck({ checked: isSelected(clientType, "Industry Worker"), font, page, x: 242, y: 418 });
  drawCheck({ checked: isSelected(clientType, "K-12"), font, page, x: 353, y: 418 });
  drawCheck({ checked: isSelected(clientType, "OFW"), font, page, x: 464, y: 418 });

  const surnameValue = formText(values, "surname");
  const firstNameValue = formText(values, "first_name");
  const middleNameValue = formText(values, "middle_name");

  drawBoxedText({
    cellWidth: profileCellWidth,
    font,
    gridX: profileGridX,
    page,
    startColumn: PROFILE_NAME_GRID.rows.surname.startColumn,
    value: surnameValue,
    x: profileGridX,
    y: PROFILE_NAME_GRID.rows.surname.y,
  });
  drawBoxedText({
    cellWidth: profileCellWidth,
    font,
    gridX: profileGridX,
    page,
    startColumn: PROFILE_NAME_GRID.rows.firstName.startColumn,
    value: firstNameValue,
    x: profileGridX,
    y: PROFILE_NAME_GRID.rows.firstName.y,
  });
  drawBoxedText({
    cellWidth: profileCellWidth,
    font,
    gridX: profileGridX,
    page,
    startColumn: PROFILE_NAME_GRID.rows.middleName.startColumn,
    value: middleNameValue,
    x: profileGridX,
    y: PROFILE_NAME_GRID.rows.middleName.y,
  });
  drawValue({ font, maxWidth: 45, page, size: 7, value: formText(values, "middle_initial"), x: 425, y: 331 });
  drawValue({ font, maxWidth: 55, page, size: 7, value: formText(values, "name_extension"), x: 525, y: 331 });

  if (PROFILE_CALIBRATION_MODE) {
    drawProfileCalibrationGuides({
      cellCount: 8,
      font,
      label: "S",
      page,
      profileGridX,
      profileCellWidth,
      rowY: PROFILE_NAME_GRID.rows.surname.y,
      startColumn: PROFILE_NAME_GRID.rows.surname.startColumn,
    });
    drawProfileCalibrationGuides({
      cellCount: 12,
      font,
      label: "F",
      page,
      profileGridX,
      profileCellWidth,
      rowY: PROFILE_NAME_GRID.rows.firstName.y,
      startColumn: PROFILE_NAME_GRID.rows.firstName.startColumn,
    });
    drawProfileCalibrationGuides({
      cellCount: 8,
      font,
      label: "M",
      page,
      profileGridX,
      profileCellWidth,
      rowY: PROFILE_NAME_GRID.rows.middleName.y,
      startColumn: PROFILE_NAME_GRID.rows.middleName.startColumn,
    });
  }

  drawValue({ font, maxWidth: 80, page, size: 7, value: formText(values, "street"), x: 98, y: 294 });
  drawValue({ font, maxWidth: 100, page, size: 7, value: formText(values, "barangay"), x: 192, y: 294 });
  drawValue({ font, maxWidth: 90, page, size: 7, value: formText(values, "district"), x: 323, y: 294 });
  drawValue({ font, maxWidth: 75, page, size: 7, value: formText(values, "city"), x: 98, y: 269 });
  drawValue({ font, maxWidth: 55, page, size: 7, value: formText(values, "province"), x: 199, y: 269 });
  drawValue({ font, maxWidth: 80, page, size: 7, value: formText(values, "region"), x: 261, y: 269 });
  drawValue({ font, maxWidth: 55, page, size: 7, value: formText(values, "zip_code"), x: 360, y: 269 });

  drawValue({ font, maxWidth: 100, page, size: 7, value: formText(values, "mother_name"), x: 100, y: 247 });
  drawValue({ font, maxWidth: 100, page, size: 7, value: formText(values, "father_name"), x: 284, y: 247 });

  const sex = formText(values, "sex");
  drawCheck({ checked: isSelected(sex, "Male") || isSelected(sex, "Lalaki"), font, page, x: 16, y: 210 });
  drawCheck({ checked: isSelected(sex, "Female") || isSelected(sex, "Babae"), font, page, x: 16, y: 192 });

  const civilStatus = formText(values, "civil_status");
  drawCheck({ checked: isSelected(civilStatus, "Single"), font, page, x: 79, y: 210 });
  drawCheck({ checked: isSelected(civilStatus, "Married") || isSelected(civilStatus, "May Asawa"), font, page, x: 79, y: 192 });
  drawCheck({ checked: isSelected(civilStatus, "Widow/er") || isSelected(civilStatus, "Biyudo/Biyuda"), font, page, x: 79, y: 174 });
  drawCheck({ checked: isSelected(civilStatus, "Separated") || isSelected(civilStatus, "Hiwalay"), font, page, x: 79, y: 156 });

  drawValue({ font, maxWidth: 145, page, size: 7, value: formText(values, "telephone"), x: 177, y: 210 });
  drawValue({ font, maxWidth: 145, page, size: 7, value: formText(values, "mobile"), x: 177, y: 192 });
  drawValue({ font, maxWidth: 145, page, size: 7, value: formText(values, "email"), x: 177, y: 174 });
  drawValue({ font, maxWidth: 145, page, size: 7, value: formText(values, "fax"), x: 177, y: 156 });

  const education = formText(values, "education");
  drawCheck({ checked: isSelected(education, "Elementary Graduate"), font, page, x: 357, y: 210 });
  drawCheck({ checked: isSelected(education, "High School Graduate"), font, page, x: 357, y: 192 });
  drawCheck({ checked: isSelected(education, "TVET Graduate"), font, page, x: 357, y: 174 });
  drawCheck({ checked: isSelected(education, "College Level"), font, page, x: 357, y: 156 });
  drawCheck({ checked: isSelected(education, "College Graduate"), font, page, x: 357, y: 140 });
  drawCheck({ checked: isSelected(education, "Others") || isSelected(education, "Iba pa"), font, page, x: 357, y: 127 });

  const employment = formText(values, "employment_status");
  drawCheck({ checked: isSelected(employment, "Casual"), font, page, x: 469, y: 210 });
  drawCheck({ checked: isSelected(employment, "Job Order"), font, page, x: 469, y: 192 });
  drawCheck({ checked: isSelected(employment, "Probationary"), font, page, x: 469, y: 174 });
  drawCheck({ checked: isSelected(employment, "Permanent"), font, page, x: 469, y: 156 });
  drawCheck({ checked: isSelected(employment, "Self-Employed"), font, page, x: 469, y: 140 });
  drawCheck({ checked: isSelected(employment, "OFW"), font, page, x: 469, y: 127 });

  const birthDate = formText(values, "birth_date");
  drawValue({ font, maxWidth: 110, page, size: 7, value: birthDate, x: 128, y: 114 });
  drawValue({ font, maxWidth: 170, page, size: 7, value: formText(values, "birth_place"), x: 350, y: 114 });
  drawValue({ font, maxWidth: 28, page, size: 7, value: formText(values, "age"), x: 552, y: 114 });

  const workColumns = [
    { x: 15, maxWidth: 135 },
    { x: 164, maxWidth: 50 },
    { x: 221, maxWidth: 85 },
    { x: 314, maxWidth: 92 },
    { x: 420, maxWidth: 75 },
    { x: 505, maxWidth: 72 },
  ];
  [56, 45, 34].forEach((y, row) => {
    drawTableRow({ columns: workColumns, font, page, prefix: `work_experience_${row}`, values, y });
  });
}

function drawSecondPage(page: PDFPage, font: PDFFont, values: PdfFormValues) {
  const trainingColumns = [
    { x: 20, maxWidth: 155 },
    { x: 190, maxWidth: 100 },
    { x: 303, maxWidth: 82 },
    { x: 397, maxWidth: 45 },
    { x: 456, maxWidth: 115 },
  ];
  [758, 746, 734, 722].forEach((y, row) => {
    drawTableRow({ columns: trainingColumns, font, page, prefix: `training_${row}`, values, y });
  });

  const licensureColumns = [
    { x: 20, maxWidth: 145 },
    { x: 177, maxWidth: 38 },
    { x: 224, maxWidth: 75 },
    { x: 310, maxWidth: 75 },
    { x: 396, maxWidth: 80 },
    { x: 487, maxWidth: 78 },
  ];
  [640, 629, 618].forEach((y, row) => {
    drawTableRow({ columns: licensureColumns, font, page, prefix: `licensure_${row}`, values, y });
  });

  const competencyColumns = [
    { x: 20, maxWidth: 150 },
    { x: 182, maxWidth: 38 },
    { x: 231, maxWidth: 65 },
    { x: 308, maxWidth: 78 },
    { x: 398, maxWidth: 88 },
    { x: 497, maxWidth: 75 },
  ];
  [529, 518, 507].forEach((y, row) => {
    drawTableRow({ columns: competencyColumns, font, page, prefix: `competency_${row}`, values, y });
  });

  drawValue({
    font,
    maxWidth: 180,
    page,
    size: 8,
    value: formText(values, "admission_applicant_name"),
    x: 100,
    y: 368,
  });
  drawValue({
    font,
    maxWidth: 150,
    page,
    size: 8,
    value: formText(values, "admission_tel"),
    x: 340,
    y: 368,
  });
  drawValue({
    font,
    maxWidth: 170,
    page,
    size: 8,
    value: formText(values, "admission_assessment"),
    x: 125,
    y: 337,
  });
  drawValue({
    font,
    maxWidth: 135,
    page,
    size: 8,
    value: formText(values, "official_receipt_number"),
    x: 385,
    y: 337,
  });
}

export async function generateFilledApplicationPdfBlob(form: HTMLFormElement) {
  const values = collectFormValues(form);
  const sourcePdf = await fetch(pdfPath).then((response) => {
    if (!response.ok) {
      throw new Error("Unable to load the application PDF template.");
    }

    return response.arrayBuffer();
  });

  const pdf = await PDFDocument.load(sourcePdf);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const [pageOne, pageTwo] = pdf.getPages();

  if (pageOne) {
    drawFirstPage(pageOne, font, values);
  }

  if (pageTwo) {
    drawSecondPage(pageTwo, font, values);
  }

  const pdfBytes = await pdf.save();
  return toPdfBlob(pdfBytes);
}

export async function generateSAGCompilationPdfBlob({
  assessmentTitle,
  responses,
}: {
  assessmentTitle: string;
  responses: Array<{ answer: string; question: string; section: string }>;
}) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let page = pdf.addPage([612, 792]);
  let y = 760;

  const writeLine = (text: string, size = 10, indent = 0) => {
    if (y < 50) {
      page = pdf.addPage([612, 792]);
      y = 760;
    }
    page.drawText(text, {
      font,
      maxWidth: 560 - indent,
      size,
      x: 30 + indent,
      y,
    });
    y -= size + 6;
  };

  writeLine("SELF-ASSESSMENT GUIDE - COMPILATION", 13);
  writeLine(`ASSESSMENT TITLE: ${assessmentTitle || "N/A"}`, 10);
  y -= 4;

  let currentSection = "";
  responses.forEach((entry, index) => {
    if (entry.section !== currentSection) {
      currentSection = entry.section;
      y -= 4;
      writeLine(currentSection, 10);
    }
    writeLine(`${index + 1}. [${entry.answer}] ${entry.question}`, 9, 10);
  });

  const pdfBytes = await pdf.save();
  return toPdfBlob(pdfBytes);
}

export async function generateConsentFormPdfBlob({
  applicantName,
}: {
  applicantName: string;
}) {
  const sourcePdf = await fetch(consentPdfPath).then((response) => {
    if (!response.ok) {
      throw new Error("Unable to load the consent form PDF template.");
    }
    return response.arrayBuffer();
  });

  const pdf = await PDFDocument.load(sourcePdf);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const [page] = pdf.getPages();
  if (page) {
    page.drawText(applicantName.toUpperCase(), {
      font,
      maxWidth: 220,
      size: 9,
      x: 120,
      y: 145,
    });
  }
  const pdfBytes = await pdf.save();
  return toPdfBlob(pdfBytes);
}

export async function downloadFilledApplicationPdf(form: HTMLFormElement) {
  const blob = await generateFilledApplicationPdfBlob(form);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tesda-application-form.pdf";
  link.click();
  URL.revokeObjectURL(url);
}
