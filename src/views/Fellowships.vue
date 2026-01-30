<template>
  <div class="vcontainer fellowships">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container fellowships-content">
      <div class="section training-section">
        <div class="section-header">
          <div class="section-header-left">
            <div class="section-title">Training pathways</div>
            <div class="section-desc">
              Two structured pathways are available: the FMF clinical fellowship (2 years) and the Diploma in fetal medicine.
              Details are outlined below.
            </div>
          </div>
        </div>
        <el-collapse class="collapse" accordion>
          <el-collapse-item name="clinical">
            <template #title>
              <div class="collapse-title">FMF clinical fellowships (2 years)</div>
            </template>
            <div class="collapse-body">
              <p>
                Every year the Fetal Medicine Foundation (FMF) awards several two-year training fellowships in fetal medicine.
                Practical training is undertaken at the Fetal Medicine units at King's College Hospital (London), Medway
                Maritime Hospital (Kent), Southend University Hospital (Essex), Homerton University Hospital (London),
                North Middlesex University Hospital (London) and University Hospital Lewisham (London).
              </p>
              <p>
                During the period of training, doctors are closely supervised by Professor Nicolaides and a team of
                Consultants in Fetal Medicine. They observe and actively assist in the management of a wide range of
                conditions, from screening for fetal abnormalities to complex conditions diagnosed antenatally, such as
                twin-to-twin transfusion syndrome.
              </p>
              <p>
                The involvement of the doctors varies depending on experience, but the aim is that trainees become
                competent in all aspects of patient care and counselling.
              </p>
              <p>
                By the end of the Training Fellowship the doctor is expected to have obtained the FMF Certificates of
                competence in:
              </p>
              <ul>
                <li>Nuchal translucency scan</li>
                <li>Assessment of the nasal bone</li>
                <li>Assessment of ductus venosus flow</li>
                <li>Assessment of tricuspid flow</li>
                <li>Preeclampsia screening</li>
                <li>Fetal defects</li>
                <li>Fetal echocardiography</li>
                <li>Doppler ultrasound</li>
                <li>Cervical assessment</li>
              </ul>
              <p>
                Obstetricians registered with the General Medical Council receive training in amniocentesis and chorion
                villus sampling and receive the appropriate FMF certificate of competence.
              </p>
              <p>
                Trainees have the opportunity to develop research interests in fetal-maternal medicine or take part in
                ongoing research studies. Doctors who obtain all Certificates of Competence and participate in research
                will be eligible for the FMF Diploma in fetal medicine.
              </p>
              <p>
                The FMF does not provide any other kind of practical training apart from the two-year fellowship.
              </p>
              <div class="inline-actions">
                <a class="inline-link" href="https://www.fetalmedicine.org/lists/map/certified/training-fellowship" target="_blank" rel="noopener">
                  The list of doctors who have completed or are still engaged in training fellowships in fetal medicine
                </a>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item name="diploma">
            <template #title>
              <div class="collapse-title">Diploma in fetal medicine</div>
            </template>
            <div class="collapse-body">
              <p>
                The practice of fetal medicine has major implications not only for the individual family, but for
                society as a whole. There are training programs for subspecialization in fetal-maternal medicine in the
                USA, UK, Australia and Canada. However, the number is limited and these programs are not designed to meet
                the increasing worldwide demand for specialists.
              </p>
              <p>
                The Diploma in fetal medicine builds on existing specialization programs and aims to raise training
                standards internationally.
              </p>
              <div class="subsection-title">Requirements</div>
              <p>
                The Diploma in fetal medicine will be awarded only to candidates who have successfully completed the
                two-year FMF clinical fellowship.
              </p>
              <div class="subsection-title">Training</div>
              <p>
                The practical component of the Diploma is a full-time structured training program designed to cover the
                diagnosis and management of the whole spectrum of fetal disorders and pregnancy complications.
              </p>
              <p>
                Candidates are expected to acquire a high standard of competence in the clinical management of
                high-risk pregnancies; ultrasound diagnosis and management of fetal anatomical and functional
                abnormalities; Doppler assessment of the uterine and fetal circulations; amniocentesis, chorion villus
                sampling and cordocentesis.
              </p>
              <div class="subsection-title">Required knowledge</div>
              <el-collapse class="collapse knowledge-collapse">
                <el-collapse-item
                  v-for="item in diplomaKnowledge"
                  :key="item.title"
                  :name="item.title">
                  <template #title>
                    <div class="knowledge-title">
                      <span class="knowledge-bullet"></span>
                      {{ item.title }}
                    </div>
                  </template>
                  <div class="knowledge-desc">{{ item.desc }}</div>
                </el-collapse-item>
              </el-collapse>
              <div class="subsection-title">Application for obtaining the Diploma in fetal medicine</div>
              <p>
                For any enquiries, please email <a class="inline-link" href="mailto:fellowship@fetalmedicine.org">fellowship@fetalmedicine.org</a>.
              </p>
              <div class="inline-actions">
                <a class="inline-link" href="https://fetalmedicine.org/lists/map/certified/diploma" target="_blank" rel="noopener">
                  List of sonographers who have obtained the FMF Diploma in fetal medicine
                </a>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="section">
        <div class="section-title">Applications for FMF clinical fellowships</div>
        <div class="section-desc">
          Applicants should complete the FMF Fellowship form and send it together with a reference from the head of the
          department in their hospital to <a class="inline-link" href="mailto:education@fetalmedicine.org">education@fetalmedicine.org</a>.
        </div>
        <div class="section-desc">
          It is important that before you apply you have completed all internet based theoretical courses.
        </div>
        <div class="section-desc">
          Successful applicants will attend an interview.
        </div>
        <div class="section-desc">
          The FMF does not provide any other kind of practical training apart from the two‑year fellowship.
        </div>
        <div class="inline-actions">
          <a class="inline-link" href="https://fetalmedicine.org/var/uploads/UActiveRecord/0/0/F/M/F/FMFfellowform.docx" target="_blank" rel="noopener">
            FMF Fellowship application form
          </a>
          <a class="inline-link" href="https://fetalmedicine.org/education/internet-based-courses" target="_blank" rel="noopener">
            Internet‑based theoretical courses
          </a>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Applications for project grants</div>
        <div class="section-desc">
          Clinical research fellows or subspecialty trainees in Maternal‑Fetal Medicine can apply for research grants
          (up to £1 million per year). Projects should meet the following criteria:
        </div>
        <ul class="criteria-list">
          <li>The study is based in an NHS hospital in England.</li>
          <li>Approval from the National Research Ethics Service (NRES).</li>
          <li>Approval from the Research &amp; Development (R&amp;D) department of the hospital.</li>
          <li>Approval from the Health Research Authority (HRA) for multicentre studies.</li>
          <li>Peer review from outside the institution where the study is to be carried out.</li>
          <li>Study registered with ClinicalTrials.gov or ISRCTN.</li>
          <li>The applicant has a Certificate of Good Clinical Practice.</li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'FellowshipsPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/fmf_fellowships_header.jpeg'),
          title: 'FMF Fellowships',
          desc: ''
        }],
        diplomaKnowledge: [
          {
            title: 'Fetal development',
            desc: 'Embryology, including normal and abnormal development of major systems. Teratogenicity, including mechanisms and agents.'
          },
          {
            title: 'Genetics',
            desc: 'Modes of inheritance, syndromology, molecular genetics and gene therapy, cytogenetics (conventional and molecular), pre-implantation diagnosis, genetic counselling.'
          },
          {
            title: 'Fetal malformations',
            desc: 'Ultrasound features, prenatal and postnatal management, and prognosis for abnormalities of the brain and spinal cord, face, heart and great arteries, lungs, diaphragm, gastrointestinal and urogenital tracts, abdominal wall and skeletal system. Chromosomal defects, including epidemiology, implications and prenatal screening by ultrasound, serum biochemistry and analysis of cell-free DNA in maternal blood.'
          },
          {
            title: 'Diagnostic testing',
            desc: 'The indications, risks and techniques of amniocentesis, chorion villus sampling and cordocentesis.'
          },
          {
            title: 'Fetal therapy',
            desc: 'Animal models, medical treatment (transplacental and fetal), intrauterine surgery (open, laparoscopic and ultrasound-guided). Pathophysiology, assessment and management of red cell isoimmunization, alloimmune thrombocytopenia, monochorionic twins, diaphragmatic hernia, fetal hydrops and obstructive uropathy.'
          },
          {
            title: 'Maternal and fetal physiology',
            desc: 'Maternal physiological adaptation to pregnancy, including cardiovascular, respiratory, renal, endocrinological, hematological and nutritional changes. Placental physiology in normal and pathological pregnancy, including developmental anatomy and structure, metabolic and endocrine function, and transfer. Amniotic fluid, including origin, composition and regulation. Fetal physiology in normal and pathological pregnancy, including fetal biochemistry, hematology, endocrinology and immunology, regulation of acid-base balance, fetal behavior and biophysical profile.'
          },
          {
            title: 'Perinatal pathology',
            desc: 'Perinatal death and placental pathological examination. Use of MRI and minimally invasive post-mortem examination.'
          },
          {
            title: 'Neonatology',
            desc: 'Basic assessment and resuscitation, intensive care, ventilation and nutrition, growth retardation, macrosomia, infection, brain hemorrhage, periventricular leukomalacia, enterocolitis, survival and handicap, prediction of handicap.'
          },
          {
            title: 'Preterm delivery',
            desc: 'Uterine activity (to include anatomy, physiology, molecular biology), pathophysiology, implications, screening, prevention, diagnosis, assessment and management.'
          },
          {
            title: 'Impaired placentation',
            desc: 'Fetal growth restriction, preeclampsia and fetal loss. Pathophysiology, implications, screening, prevention, diagnosis, assessment and management.'
          },
          {
            title: 'Medical disorders',
            desc: 'Diabetes mellitus, autoimmune disease including systemic lupus erythematosus and antiphospholipid antibodies, cardiovascular, pulmonary, renal, hepatic, hematological, neoplastic disorders. Pathophysiology, implications, screening, prevention, diagnosis, assessment and management.'
          },
          {
            title: 'Infections',
            desc: 'Toxoplasmosis, cytomegalovirus, rubella, human immunodeficiency virus, hepatitis, varicella, Coxsackie, Parvovirus B19, Listeria. Pathophysiology, implications, screening, prevention, diagnosis, assessment and management.'
          },
          {
            title: 'Multiple pregnancy',
            desc: 'Epidemiology, pathophysiology, chorionicity, discordancy for defects, growth or death, twin-to-twin transfusion syndrome, prenatal diagnosis, assessment and monitoring, multifetal pregnancy reduction.'
          },
          {
            title: 'Implications for the individual and society',
            desc: 'Ethics, law, psychology, sociology, politics, economics.'
          },
          {
            title: 'Research methodology',
            desc: 'Medical statistics and epidemiology. Undertaking a literature search and summarizing the findings, planning a research project, writing an application for a grant-giving body and research ethics committee, computerization, statistical analysis and interpretation of data and writing an audit report, scientific papers and a thesis.'
          },
          {
            title: 'Organization and administration of fetal medicine service',
            desc: 'Structured training, clinical protocols, consent forms, research versus audit in clinical practice, patient notes, counselling, computerization.'
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fellowships {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }

  ::v-deep .top-banner .top-banner-content {
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  ::v-deep .top-banner .top-banner-content .title {
    margin: 0;
  }

  .fellowships-content {
    gap: 28px;
    padding: 24px 16px 0;
    box-sizing: border-box;
  }

  ::v-deep .top-banner .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
  }

  .section {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 6px 20px rgba(14, 48, 69, 0.06);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .section-header-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1 1 auto;
    min-width: 0;
  }


  .section-title {
    font-size: 20px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
  }

  .criteria-list {
    margin: 12px 0 0 18px;
    padding: 0;
    color: #4a5b67;
    line-height: 26px;
  }

  .criteria-list li {
    margin-bottom: 6px;
  }

  .collapse {
    border: none;
  }

  ::v-deep .collapse .el-collapse-item__header {
    font-size: 16px;
    font-weight: 600;
    color: #036fc0;
    padding: 12px 0;
    border-bottom: 1px solid #edf1f6;
  }

  ::v-deep .collapse .el-collapse-item__header::after {
    content: none;
  }

  ::v-deep .collapse .el-collapse-item__header .el-collapse-item__arrow {
    display: none;
  }

  ::v-deep .collapse .el-collapse-item__header .collapse-title {
    position: relative;
    padding-right: 36px;
  }

  ::v-deep .collapse .el-collapse-item__header .collapse-title::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 10px solid #036fc0;
    animation: arrowBounce 1.4s ease-in-out infinite;
  }

  @keyframes arrowBounce {
    0%, 100% { transform: translateY(-50%); }
    50% { transform: translateY(-29%); }
  }

  ::v-deep .collapse .el-collapse-item__content {
    padding: 12px 0 0;
    color: #4a5b67;
    line-height: 26px;
    font-size: 16px;
  }

  .collapse-body p {
    margin: 0 0 12px;
  }

  .collapse-body ul {
    margin: 8px 0 12px 18px;
    padding: 0;
  }

  .collapse-body li::marker {
    color: #036fc0;
  }

  .collapse-body li {
    margin-bottom: 6px;
  }

  .inline-actions {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .inline-link {
    color: #036fc0;
    font-weight: 600;
    text-decoration: underline;
  }

  .subsection-title {
    margin: 12px 0 6px;
    font-weight: 600;
    color: #0e3045;
  }

  .knowledge-title {
    font-weight: 600;
    color: #0e3045;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 8px;
  }

  .knowledge-bullet {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #036fc0;
    flex: 0 0 8px;
  }

  .knowledge-desc {
    color: #4a5b67;
  }

  .knowledge-collapse {
    border: none;
  }

  ::v-deep .knowledge-collapse .el-collapse-item__header {
    font-size: 15px;
    font-weight: 600;
    color: #0e3045;
    padding: 10px 0;
    border-bottom: 1px solid #edf1f6;
  }

  ::v-deep .knowledge-collapse .el-collapse-item__content {
    padding: 8px 0 12px;
    color: #4a5b67;
    line-height: 26px;
    font-size: 15px;
  }
</style>
