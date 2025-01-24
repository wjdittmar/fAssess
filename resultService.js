const ResultSchema = new mongoose.Schema({
  clinic_id: ObjectId, // This is a "foreign key" to Clinic collection
  patient_id: Number, // This is a "foreign key" to Patient collection
  field_nm: String,
  field_value: String,
});

// Instantiate the model to access the Result collection in DB
const ResultModel = mongoose.model("Result", ResultSchema);

const POSSIBLE_PATIENT_IDS = [1, 2, 3, 4, 5];
const POSSIBLE_FIELDS = ["a", "b", "c"];

const DEFAULT_VALUE = "";

async function getTableData(clinicId) {
  // part 1
  const dpList = await ResultModel.find({ clinic_id: clinicId }).exec();

  // part 2
  const lookup = {};

  for (const dp of dpList) {
    if (!lookup[dp.patient_id]) {
      lookup[dp.patient_id] = {};
    }

    lookup[dp.patient_id][dp.field_nm] = dp.field_value;
  }

  const dynamicList = POSSIBLE_PATIENT_IDS.map((pid) => {
    const row = {
      patient_id: pid,
      a: DEFAULT_VALUE,
      b: DEFAULT_VALUE,
      c: DEFAULT_VALUE,
    };

    const dataForPatient = lookup[pid];
    if (dataForPatient) {
      POSSIBLE_FIELDS.forEach((field) => {
        if (field in dataForPatient) {
          row[field] = dataForPatient[field];
        }
      });
    }

    return row;
  });

  return dynamicList;
}
