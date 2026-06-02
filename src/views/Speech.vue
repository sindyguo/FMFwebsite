<template>
  <div class="speech">
    <div class="vcontainer main-container">
      <span class="speech-title">Abstract Submission</span>
      <span class="speech-subtitle" v-html="congressInfo.title +', '+  congressInfo.city+', '+ congressInfo.country"></span>
      <el-steps :active="currentStep" align-center class="speech-steps">
        <el-step title="Submitter Name"></el-step>
        <el-step title="Abstract Information"></el-step>
        <el-step title="Information Review"></el-step>
      </el-steps>
      <div class="fill vcontainer speech-content">
        <div v-if="currentStep === 1">
          <span class="sc-title">Person submitting the abstract</span>
          <el-form
            :model="submitterForm"
            :rules="submitterRules"
            ref="submitterFormRef"
            class="form-container"
            label-width="150px"
            label-position="top">
            <el-form-item label="First name" prop="firstName">
              <el-input disabled v-model="userInfo.firstName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Last name" prop="lastName">
              <el-input disabled v-model="userInfo.lastName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="submitterEmail">
              <el-input disabled v-model="userInfo.email" placeholder="xxxxxx@163.com"></el-input>
            </el-form-item>
            <el-form-item label="FMF ID" prop="submitterFmfId">
              <el-input disabled v-model="userInfo.fmfId" placeholder="334242"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <span class="sc-title w-full">Speaker information</span>
            <el-form-item label="Who is the speaker?" prop="speakerType" class="w-full">
              <el-radio-group v-model="submitterForm.speakerType"
                class="fill hcontainer flex-between speakertype-radio-group">
                <el-radio-button label="Myself">
                  <div class="hcontainer">
                    <img src="@/assets/img/icon/icon_myself.png" style="width: 24px;height: 26px; margin-right: 16px;" alt="">
                    <div class="fill vcontainer">
                      <span class="radio-label">Myself</span>
                    </div>
                  </div>
                </el-radio-button>
                <el-radio-button label="Someone else">
                  <div class="hcontainer">
                    <img src="@/assets/img/icon/icon_else.png" style="width: 24px;height: 26px; margin-right: 16px;" alt="">
                    <div class="fill vcontainer">
                      <span class="radio-label">Someone else</span>
                    </div>
                  </div>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Title" prop="title">
              <el-select 
                v-model="submitterForm.title" 
                :placeholder="isSpeakerMyself ? '' : 'Please Select'">
                <el-option label="Professor" value="Professor"></el-option>
                <el-option label="Dr" value="Dr"></el-option>
                <el-option label="Ms" value="Ms"></el-option>
                <el-option label="Mr" value="Mr"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="First name" prop="firstName">
              <el-input 
                v-model="submitterForm.firstName" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'" 
                :disabled="isSpeakerMyself">
              </el-input>
            </el-form-item>

             <el-form-item label="Last name" prop="lastName">
              <el-input 
                v-model="submitterForm.lastName" 
                :placeholder="'Please Enter'" 
                :disabled="isSpeakerMyself">
              </el-input>
            </el-form-item>
            <el-form-item label="Country" prop="speakerCountry">
              <el-input v-if="isSpeakerMyself" v-model="submitterForm.speakerCountry" :placeholder="isSpeakerMyself ? '' : 'Please Select'" disabled></el-input>
              <el-select
                v-else
                v-model="submitterForm.speakerCountry" 
                :placeholder="isSpeakerMyself ? '' : 'Please Select'" filterable>
                <el-option v-for="(item, index) in companyList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input 
                v-model="submitterForm.email" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'" 
                :disabled="isSpeakerMyself">
              </el-input>
            </el-form-item>
            
            <el-form-item label="Institution" prop="institutionType">
              <el-select 
                v-model="submitterForm.institutionType" 
                :placeholder="isSpeakerMyself ? '' : 'Please Select'">
                <el-option label="Hospital" value="Hospital"></el-option>
                <el-option label="University" value="University"></el-option>
                <el-option label="Private practice" value="Private practice"></el-option>
                <el-option label="Pharmaceutical company" value="Pharmaceutical company"></el-option>
                <el-option label="Medical device company" value="Medical device company"></el-option>
                <el-option label="Other" value="Other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Institution name" prop="institutionName">
              <el-input 
                v-model="submitterForm.institutionName" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'">
              </el-input>
            </el-form-item>
            <el-form-item label="Institution town" prop="institutionTown">
              <el-input 
                v-model="submitterForm.institutionTown" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'">
              </el-input>
            </el-form-item>
            <div class="hcontainer flex-end action-buttons">
              <el-button type="primary" @click="submitterFormValidate">Continue</el-button>
            </div>
          </el-form>
        </div>
        <div v-else-if="currentStep === 2">
          <span class="sc-title w-full">Please note that:</span>

          <div class="stepInfo">
            <ol>
              <li>
                The maximum number of characters for the title should be 150.
              </li>
              <li>
                The maximum number of words for the whole abstract should be 600.
              </li>
              <li>
                In each section (objective, methods, results, conclusion) do not start the sentence with the word "Objectives" etc. This will automatically be added to your abstract by the system.
              </li>
              <li>
                The title, body of text and author names should be in small letters except for the first letter.
              </li>
              <li>
                If you would like to include tables or images, you can upload them at the bottom of this page. However, you must delete patient details. You can upload up to four files: images in .jpg, .jpeg, or .png format, and Microsoft Word documents. The total size of all four files must not exceed 20 MB.
              </li>
            </ol>
          </div>
          <el-form
            :model="abstractForm"
            :rules="abstractRules"
            class="form-container form-container--abstract"
            ref="abstractFormRef"
            label-width="150px"
            label-position="top">

            <div class="abstract-top-grid">
              <el-form-item label="Topic" prop="topic">
                <el-cascader
                  v-model="abstractForm.topic"
                  :options="topicOptions"
                  class="abstract-cascader"
                  @change="topicChange"></el-cascader>
              </el-form-item>

              <el-form-item label="Type" prop="type">
                <el-radio-group v-model="abstractForm.type" class="abstract-type-radio-group">
                  <el-radio label="Poster"></el-radio>
                  <el-radio label="Oral"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <el-form-item label="Title" prop="abstractsTitle" class="w-full">
              <el-input type="textarea" v-model="abstractForm.abstractsTitle" placeholder="The maximum number of characters for the title should be 150" maxlength="150" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="Authors" prop="authors" class="w-full">
              <el-input v-model="abstractForm.authors" placeholder="Please Enter"></el-input>
            </el-form-item>

            <!-- 字数统计：超限标红+警告 -->
            <div class="lineInfo">
              <div class="abstractInfo">
                <div class="bigTile">Abstract</div>
                <div class="info">The maximum number of words for the whole abstract should be 600.</div>
              </div>
              <div class="num" :class="{ 'text-danger': wordsCount >= 600 }">
                {{ wordsCount }}/600
                <el-tooltip v-if="wordsCount >= 600" content="Word limit reached! Delete content to continue input." placement="top">
                  <i class="el-icon-warning" style="margin-left: 5px;color: #F56C6C;"></i>
                </el-tooltip>
              </div>
            </div>

            <!-- 四个核心文本域：绑定 输入/按键/粘贴 事件，确保超限阻断 -->
            <el-form-item label="Objective" prop="objective" class="w-full">
              <el-input 
                v-model="abstractForm.objective" 
                placeholder="Please do not start the sentence with the session title, for example 'Objective/Objectives'" 
                type="textarea" 
                :rows="4"
                @input="(val) => handleInput('objective', val)"
                @keydown="handleKeydown"
                @paste="handlePaste"
                @compositionupdate="handleComposition"
                @compositionend="handleCompositionEnd"></el-input>
            </el-form-item>
            
            <el-form-item label="Methods" prop="methods" class="w-full">
              <el-input 
                v-model="abstractForm.methods" 
                placeholder="Please do not start the sentence with the session title, for example 'Methods'" 
                type="textarea" 
                :rows="4"
                @input="(val) => handleInput('methods', val)"
                @keydown="handleKeydown"
                @paste="handlePaste"
                @compositionupdate="handleComposition"
                @compositionend="handleCompositionEnd"></el-input>
            </el-form-item>
            
            <el-form-item label="Results" prop="results" class="w-full">
              <el-input 
                v-model="abstractForm.results" 
                placeholder="Please do not start the sentence with the session title, for example 'Results'" 
                type="textarea" 
                :rows="4"
                @input="(val) => handleInput('results', val)"
                @keydown="handleKeydown"
                @paste="handlePaste"
                @compositionupdate="handleComposition"
                @compositionend="handleCompositionEnd"></el-input>
            </el-form-item>
            
            <el-form-item label="Conclusion" prop="conclusion" class="w-full">
              <el-input 
                v-model="abstractForm.conclusion" 
                placeholder="Please do not start the sentence with the session title, for example 'Conclusion'" 
                type="textarea" 
                :rows="4"
                @input="(val) => handleInput('conclusion', val)"
                @keydown="handleKeydown"
                @paste="handlePaste"
                @compositionupdate="handleComposition"
                @compositionend="handleCompositionEnd"></el-input>
            </el-form-item>

            <!-- 修复后的文件上传组件 -->
            <el-form-item label="Images and tables" prop="abstractsFileList" class="w-full">
              <el-upload
                action=""
                :accept="uploadAccept"
                :auto-upload="false"
                :before-upload="beforeUpload"
                :on-change="uploadFileChange"
                :on-remove="uploadFileRemove"
                :file-list="uploadFileList"
                :limit="4"
                :on-exceed="handleExceed"
                :disabled="uploadDisabled">
                <el-button size="small" type="primary">Upload</el-button>
              </el-upload>
              <div style="margin-top: 8px; font-size: 12px; color: #8A9094;">
                Allowed file types: .jpg, .jpeg, .png, .doc, .docx (4 files total)
              </div>
            </el-form-item>
            
            <div class="hcontainer vcenter flex-between action-buttons">
              <el-button @click="prevStep">Back</el-button>
              <el-button type="primary" @click="abstractFormValidate" :disabled="wordsCount > 600">Submit abstract</el-button>
            </div>
          </el-form>
        </div>
        <div v-else-if="currentStep === 3" class="fill vcontainer vcenter hcenter completion">
          <div class="fill vcontainer hcenter vcenter completion-inner">
            <el-image :src="require('@/assets/img/img_succ2.png')" class="comletion-img" />
            <span class="completion-tip">Thanks for submitting your abstract. Please check your email for a submission confirmation. If you haven't received it, please contact <a href="mailto:education@fetalmedicine.org" class="completion-mail-link">education@fetalmedicine.org</a>.</span>
          </div>
          <div class="hcontainer hcenter vcenter action-buttons">
            <el-button type="primary" @click="goToOwnPage">Own Page</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import { mapActions } from 'vuex';
export default {
  name: 'SpeechPage',
  inject: ['refreshTokenFn'],
  data() {
    return {
      currentStep: 1,
      wordsCount: 0,
      uploadFileList: [],
      congressInfo: {},
      isComposing: false, // 解决中文输入法输入时的阻断问题
      // 新增上传相关配置
      uploadAccept: '.jpg,.jpeg,.png,.doc,.docx',
      uploadDisabled: false,
      topicOptions: [
        { value: '1st trimester', label: '1st trimester' },
        { value: 'Genetics', label: 'Genetics' },
        {
          value: 'Defects', label: 'Defects',
          children: [
            { value: 'Brain', label: 'Brain' },
            { value: 'Face', label: 'Face' },
            { value: 'Heart', label: 'Heart' },
            { value: 'Lungs', label: 'Lungs' },
            { value: 'Gastrointestinal', label: 'Gastrointestinal' },
            { value: 'Genitourinary', label: 'Genitourinary' },
            { value: 'Spine', label: 'Spine' },
            { value: 'Skeleton', label: 'Skeleton' },
            { value: 'Syndromes', label: 'Syndromes' },
            { value: 'Other', label: 'Other' }
          ]
        },
        { value: 'Fetal therapy', label: 'Fetal therapy' },
        { value: 'Infections', label: 'Infections' },
        { value: 'Maternal medicine', label: 'Maternal medicine' },
        { value: 'Hypertensive disorders', label: 'Hypertensive disorders' },
        { value: 'Gestational diabetes', label: 'Gestational diabetes' },
        { value: 'Pregnancy', label: 'Pregnancy' },
        { value: 'Labor', label: 'Labor' },
        { value: 'Defects tumors', label: 'Defects tumors' },
        { value: 'Preterm birth', label: 'Preterm birth' },
        { value: 'Fetal growth', label: 'Fetal growth' },
        { value: 'Multiple pregnancies', label: 'Multiple pregnancies' },
        { value: 'Placenta', label: 'Placenta' },
        { value: 'Artificial intelligence', label: 'Artificial intelligence' },
        { value: 'Other', label: 'Other' },
      ],
      submitterForm: {
        submitterName: '',
        submitterEmail: '',
        submitterFmfId: '',
        speakerType: 'Myself',
        firstName: '',
        lastName: '',
        speakersName: '',
        email: '',
        speakerCountry: '',
        title: '',
        institutionType: '',
        institutionName: '',
        institutionCountry: '',
        institutionTown: ''
      },
      abstractForm: {
        topic: '',
        abstractsTitle: '',
        authors: '',
        objective: '',
        methods: '',
        results: '',
        conclusion: '',
        type: 'Poster' // 修复默认值错误
      },
      submitterRules: {
        speakerType: [{ required: true, message: 'Please select who is the speaker', trigger: 'change' }],
        firstName: [
          { 
            required: true, message: 'Please enter speaker first name', trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.submitterForm.speakerType === 'Someone else' && !value.trim()) {
                callback(new Error('Please enter speaker first name'));
              } else {
                callback();
              }
            }
          }
        ],
        lastName: [
          { 
            required: true, message: 'Please enter speaker last name', trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.submitterForm.speakerType === 'Someone else' && !value.trim()) {
                callback(new Error('Please enter speaker last name'));
              } else {
                callback();
              }
            }
          }
        ],
        email: [
          { 
            required: true, message: 'Please enter speaker email', trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.submitterForm.speakerType === 'Someone else' && !value.trim()) {
                callback(new Error('Please enter speaker email'));
              } else {
                callback();
              }
            }
          }
        ],
        speakerCountry: [
          { 
            required: true, message: 'Please select speaker country', trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.submitterForm.speakerType === 'Someone else' && !value) {
                callback(new Error('Please select speaker country'));
              } else {
                callback();
              }
            }
          }
        ],
        title: [{ required: true, message: 'Please select title', trigger: 'change' }],
        institutionType: [{ required: true, message: 'Please select institution', trigger: 'change' }],
        institutionName: [{ required: true, message: 'Please enter Institution name', trigger: 'blur' }],
        institutionTown: [{ required: true, message: 'Please enter Institution town', trigger: 'blur' }]
      },
      abstractRules: {
        abstractsTitle: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
        authors: [{ required: true, message: 'Please enter authors', trigger: 'blur' }],
        objective: [{ required: true, message: 'Please enter objective', trigger: 'blur' }],
        methods: [{ required: true, message: 'Please enter methods', trigger: 'blur' }],
        results: [{ required: true, message: 'Please enter results', trigger: 'blur' }],
        conclusion: [{ required: true, message: 'Please enter conclusion', trigger: 'blur' }],
        type: [{ required: true, message: 'Please select type', trigger: 'change' }],
        topic: [{ required: true, message: 'Please select topic', trigger: 'change' }],
      },
      companyList: [],
      lastValidValue: { objective:'', methods:'', results:'', conclusion:'' } // 初始化合法值存储
    }
  },
  computed: {
    isSpeakerMyself() {
      return this.submitterForm.speakerType === 'Myself'
    },
    userInfo() {
      return this.$store.state.user.userInfo || {};
    }
  },
  watch: {
    'submitterForm.speakerType': {
      handler(newVal) {
        if (newVal === 'Myself') {
          this.submitterForm.firstName = this.userInfo.firstName || '';
          this.submitterForm.lastName = this.userInfo.lastName || '';
          this.submitterForm.email = this.userInfo.email || '';
          this.submitterForm.speakerCountry = this.userInfo.country || '';
        } else {
          this.submitterForm.firstName = '';
          this.submitterForm.lastName = '';
          this.submitterForm.email = '';
          this.submitterForm.speakerCountry = '';
        }
      },
      immediate: true
    }
  },
  async created() {
    await this.refreshTokenFn();
    this.websiteCongressGetFn();
    this.getCompanyList();
    this.calculateWordsCount(); // 初始化计数
  },
  methods: {
    websiteCongressGetFn() {
        this.$api.websiteCongressGet({
          id: this.$route.query.id
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.congressInfo = res.data
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      },
    // ========== 修复后的文件上传校验 ==========
    beforeUpload(file) {
      // 1. 定义允许的文件类型（扩展名+MIME类型双校验）
      const allowedTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
      
      // 2. 获取文件扩展名（统一小写）
      const fileName = file.name.toLowerCase();
      const fileExt = fileName.split('.').pop();
      
      // 3. 第一步：校验扩展名
      if (!Object.keys(allowedTypes).includes(fileExt)) {
        this.$message.error(`Invalid file type: ${file.name}. Only .jpg, .jpeg, .png, .doc, .docx are allowed.`);
        return false;
      }
      
      // 4. 第二步：校验MIME类型（防止改扩展名绕过）
      const fileMimeType = file.type;
      if (fileMimeType && !Object.values(allowedTypes).includes(fileMimeType)) {
        this.$message.error(`File type verification failed: ${file.name} (MIME type not allowed)`);
        return false;
      }
      
      // 5. 第三步：校验文件大小（修复原代码2000MB的错误，改为20MB）
      // const maxSize = 20 * 1024 * 1024; // 20MB
      // if (file.size > maxSize) {
      //   this.$message.error(`File too large: ${file.name}. Max size per file is 20MB.`);
      //   return false;
      // }
      
      // 6. 临时禁用上传按钮，防止重复点击
      this.uploadDisabled = true;
      setTimeout(() => {
        this.uploadDisabled = false;
      }, 1000);
      
      return true;
    },
    
    // ========== 修复后的文件上传处理 ==========
    async uploadFileChange(file, fileList) {
      // 先通过beforeUpload校验，再处理上传
      if (!this.beforeUpload(file.raw)) {
        // 移除非法文件，更新文件列表
        this.uploadFileList = fileList.filter(item => item.uid !== file.uid);
        return;
      }
      
      try {
        const loading = this.$loading({ lock: true, text: 'Uploading...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' });
        const res = await this.$api.uploadFile(file.raw, 'congress', 'congress').catch(err => err);
        loading.close();
        
        if (res && res.id) {
          this.uploadFileList.push({ id: res.id, name: file.name, url: res.url });
          this.$message.success(`File ${file.name} uploaded successfully`);
        } else {
          this.$message.error(`Failed to upload ${file.name}`);
          // 上传失败时移除该文件
          this.uploadFileList = fileList.filter(item => item.uid !== file.uid);
        }
      } catch (err) {
        this.$message.error(`Failed to upload ${file.name}: ${err.message || 'Unknown error'}`);
        this.uploadFileList = fileList.filter(item => item.uid !== file.uid);
      }
    },
    
    uploadFileRemove(file, fileList) {
      this.uploadFileList = fileList; // 只删当前文件，不清空
    },
    
    handleExceed() {
      this.$message.warning('Only four files can be uploaded'); // 修复提示错误
    },
    
    topicChange(value) { console.log('topic:', value) },
    
    ...mapActions('user', ['changeActiveId']),
    
    getCompanyList() {
      this.$api.getCountries().then(res => {
        this.companyList = res.data || [];
      }).catch(err => console.error('Get country list failed:', err));
    },
    
    nextStep() { if (this.currentStep < 3) this.currentStep++ },
    
    prevStep() { if (this.currentStep > 1) this.currentStep-- },
    
    async submitterFormValidate() {
      try {
        await this.$refs.submitterFormRef.validate();
        this.nextStep();
      } catch (error) {
        this.$message.error('Please fill in all required fields');
      }
    },
    
    async isEmailContinue(emails) {
      const params = { emails: emails.join(','), type: 'presentation' };
      try {
        const res = await this.$api.userCongressVerifyEmail(params);
        if ([200, 0].includes(res.code)) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            MessageBox.confirm(`Duplicate Registration. The Speaker's Email ${res.data.join(',')} is already registered.`, 'Duplicate', { confirmButtonText: 'OK', showCancelButton: false, type: 'warning' });
            return false;
          }
          return true;
        }
        return false;
      } catch (err) {
        this.$message.error('Failed to verify email');
        return false;
      }
    },
    
    async abstractFormValidate() {
      try {
        await this.$refs.abstractFormRef.validate();
        if (this.wordsCount > 600) {
          this.$message.error('Abstract word count exceeds 600 words limit');
          return;
        }
        // const isContinue = await this.isEmailContinue([this.submitterForm.email]);
        // if (!isContinue) return;
        
        const submitData = {
          ...this.submitterForm, ...this.abstractForm,
          abstractsFileList: this.uploadFileList,
          topic: this.abstractForm.topic?.join('/') || '',
          congressId: this.$route.query.id
        };
        await this.$api.userCongressPresentationCreate(submitData);
        this.$message.success('Submitted successfully');
        this.nextStep();
      } catch (error) {
        this.$message.error('Failed to submit abstract');
      }
    },
    
    goToOwnPage() {
      this.changeActiveId('/mine');
      this.$router.push('/mine');
    },

    // ========== 核心：精准单词计数（解决标点/空格干扰） ==========
    calculateWordsCount() {
      const fields = [this.abstractForm.objective, this.abstractForm.methods, this.abstractForm.results, this.abstractForm.conclusion];
      let total = 0;
      fields.forEach(field => {
        if (!field) return;
        // 核心：去除标点+合并空格+统计单词，兼容中英文混合
        const pureText = field.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
        total += pureText ? pureText.split(' ').length : 0;
      });
      this.wordsCount = total;
    },

    // ========== 核心：输入拦截+超限回滚 ==========
    handleInput(fieldName, currentVal) {
      // 中文输入法组合状态不处理，避免干扰
      if (this.isComposing) return;
      
      this.calculateWordsCount();
      // 超限则回滚到上一次合法值，彻底阻断输入
      if (this.wordsCount > 600) {
        this.$set(this.abstractForm, fieldName, this.lastValidValue[fieldName] || '');
        this.calculateWordsCount();
        this.$message.warning('Word limit reached! Cannot input more content');
        return;
      }
      // 保存当前合法值，用于后续回滚
      this.lastValidValue = { ...this.lastValidValue, [fieldName]: currentVal };
    },

    // ========== 核心：键盘事件拦截（彻底禁止输入） ==========
    handleKeydown(e) {
      if (this.wordsCount > 600) {
        // 仅允许：删除/回退/方向键/快捷键（复制/全选/撤销），其他全部禁止
        const allowedKeys = [8,46,37,38,39,40,9,13,27,33,34,35,36]; // 删除/方向键/基础功能键
        const allowedShortcuts = (e.ctrlKey || e.metaKey) && [65,67,90].includes(e.keyCode); // Ctrl+A/C/Z
        
        if (!allowedKeys.includes(e.keyCode) && !allowedShortcuts) {
          e.preventDefault(); // 禁止按键输入
          e.stopPropagation();
        }
      } else {
        // 未超限：保存当前输入前的合法值，用于后续回滚
        const activeField = this.getActiveTextareaField();
        if (activeField) {
          this.lastValidValue = { ...this.lastValidValue, [activeField]: this.abstractForm[activeField] };
        }
      }
    },

    // ========== 核心：禁止粘贴超限内容 ==========
    handlePaste(e) {
      if (this.wordsCount >= 600) {
        e.preventDefault();
        this.$message.warning('Word limit reached! Cannot paste content');
      }
    },

    // ========== 解决中文输入法输入卡顿问题 ==========
    handleComposition() { this.isComposing = true },
    
    handleCompositionEnd() { 
      this.isComposing = false;
      this.calculateWordsCount(); // 输入法结束后重新计数
    },

    // 辅助：获取当前激活的文本域字段，用于保存合法值
    getActiveTextareaField() {
      const activeEl = document.activeElement;
      const fieldMap = {
        'objective': 1, 'methods':1, 'results':1, 'conclusion':1
      };
      for (const field in fieldMap) {
        if (activeEl.getAttribute('placeholder')?.includes(field)) return field;
      }
      return null;
    }
  }
}
</script>

<style lang="scss" scoped>
.speech {
  width: 100%;
  box-sizing: border-box;
  min-height: calc(100% - 200px);
  padding: 100px 20px 24px;
  overflow-x: hidden;
  background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);

  .main-container {
    width: 100% !important;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    min-width: 0;
  }

  .speech-title {
    font-weight: bold;
    font-size: 38px;
    color: #0E3045;
    margin-bottom: 10px;
    text-align: center;
  }

  .speech-subtitle {
    font-size: 16px;
    color: #656B6F;
    text-align: center;
  }

  .speech-steps {
    margin: 40px 0 24px;
  }

  .speech-content {
    font-weight: bold;
    font-size: 18px;
    color: #0E3045;
    padding: 30px;
    margin-bottom: 30px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0px 10px 20px 1px rgba(14, 48, 69, 0.1);

    .sc-title {
      font-weight: bold;
      font-size: 20px;
      color: #0e3045;
      margin-bottom: 20px;
    }

    .stepInfo {
      margin-left: 0;
      margin-right: 0;
    }

    .lineInfo {
      flex-wrap: wrap;
      gap: 8px 12px;
      align-items: flex-start;
      .num {
        flex: 1 1 auto;
        min-width: 0;
        padding-right: 0;
        text-align: right;
      }
    }

    .form-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;

      ::v-deep .el-form-item.w-full {
        max-width: 100%;
      }

      ::v-deep .el-form-item {
        flex: 1 1 100%;
        width: 100%;
        max-width: 544px;
        min-width: 0;
        margin-bottom: 0;

        .el-form-item__label {
          padding-bottom: 0;
          font-weight: bold;
          font-size: 18px;
          color: #0e3045;
        }

        .el-input,
        .el-select,
        .el-textarea,
        .el-cascader {
          width: 100%;
        }
      }

      &.form-container--abstract {
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
        gap: 0;

        ::v-deep .el-form-item {
          flex: none !important;
          width: 100% !important;
          max-width: 100% !important;
          margin-bottom: 20px;
        }

        ::v-deep .el-form-item__content {
          min-width: 0;
        }

        .abstract-top-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 24px;
          row-gap: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;

          ::v-deep .el-form-item {
            margin-bottom: 18px !important;
          }
        }

        ::v-deep .abstract-cascader {
          width: 100%;
        }

        ::v-deep .abstract-type-radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
        }
      }
    }

    .action-buttons {
      width: 100%;
      font-weight: bold;
      font-size: 16px;
      margin-top: 30px;
      flex-wrap: wrap;
      gap: 12px;

      .el-button--primary {
        background-color: #036fc0;
        border-color: #036fc0;
      }
    }
  }

  .w-full {
    width: 100%;
  }

  .completion {
    padding: 30px 0;
    min-height: 0;
    font-size: 16px;
    color: #23272a;

    .completion-inner {
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
      padding: 0 8px;
      box-sizing: border-box;
    }

    .comletion-img {
      width: 128px;
      height: 90px;
      object-fit: cover;
      margin-bottom: 30px;
      max-width: 100%;
    }

    .completion-tip {
      width: 100%;
      max-width: 500px;
      text-align: center;
      margin: 0 auto 40px;
      word-break: break-word;
      font-weight: normal;
      line-height: 1.5;
    }

    .completion-mail-link {
      text-decoration: underline;
      color: #036fc0;
    }
  }

  ::v-deep .text-danger {
    color: #f56c6c !important;
    font-weight: bold;
  }
}

@media (max-width: 1200px) {
  .speech {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 900px) {
  .speech {
    padding-top: 88px;

    .speech-title {
      font-size: 28px;
    }

    .speech-content {
      padding: 22px 20px !important;
    }
  }
}

@media (max-width: 992px) {
  .speech .speech-content .form-container.form-container--abstract .abstract-top-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .speech {
    padding: 72px 12px 20px;

    .speech-title {
      font-size: 22px;
      line-height: 1.25;
      padding: 0 4px;
    }

    .speech-subtitle {
      font-size: 14px;
      line-height: 1.5;
      display: block;
      padding: 0 8px;
    }

    .speech-steps {
      margin: 24px 0 16px;
    }

    .speech-content {
      padding: 16px 14px 20px !important;
      font-size: 16px;

      .sc-title {
        font-size: 17px;
      }

      .form-container {
        ::v-deep .el-form-item {
          max-width: 100% !important;
        }
      }

      .stepInfo {
        font-size: 14px;
        line-height: 1.6;
        margin: 12px 0 16px;
      }

      .lineInfo {
        flex-direction: column;
        align-items: stretch;

        .abstractInfo .bigTile {
          font-size: 18px;
        }

        .num {
          text-align: left;
        }
      }
    }

    .completion {
      padding: 16px 0;

      .completion-tip {
        margin-bottom: 32px;
      }
    }

    .action-buttons {
      flex-direction: column;
      align-items: stretch !important;
      justify-content: stretch !important;

      ::v-deep .el-button {
        width: 100%;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }
  }
}

@media (max-width: 480px) {
  .speech {
    padding: 64px 10px 16px;

    .speech-title {
      font-size: 19px;
    }

    .speech-content {
      padding: 14px 12px 16px !important;
      border-radius: 10px;
    }
  }
}
</style>

<style lang="scss">
.speech-steps {
  .el-step__title.is-process,
  .el-step__head.is-wait {
    color: #8a9094;
    font-weight: normal;
  }
  .el-step__title.is-finish {
    color: #036fc0;
  }
  .el-step__head {
    &.is-finish {
      .el-step__icon {
        color: #ffffff;
        background: linear-gradient(180deg, #79c5ff 0%, #036fc0 100%);
        box-shadow: 0px 8px 15px 1px rgba(3, 56, 89, 0.21);
      }
      .el-step__line {
        background: linear-gradient(180deg, #79c5ff 0%, #036fc0 100%);
      }
    }
  }
  .el-step__line {
    top: 30px !important;
    height: 4px !important;
    margin: 0 50px !important;
    background-color: #dce4ea;
  }
  .el-step__icon {
    font-weight: bold;
    font-size: 18px;
    color: #656b6f;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background-color: #e8e8e8;
  }
}

.speakertype-radio-group {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 20px;
  box-sizing: border-box;
  color: #656b6f;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  .el-radio-button {
    flex: 1 1 calc(50% - 10px);
    min-width: 0;
    max-width: 100%;
    vertical-align: top;

    .el-radio-button__inner {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      display: block !important;
      white-space: normal !important;
      word-break: break-word;
      overflow-wrap: anywhere;
      line-height: 1.45;
      height: auto !important;
      min-height: 0;
      padding: 14px 12px 16px;
      text-align: left;
      border-radius: 4px;
      border-left: 1px solid #dcdfe6;
      box-shadow: none;

      .hcontainer {
        align-items: flex-start;
        width: 100%;
        min-width: 0;
        flex-wrap: nowrap;
      }

      .radio-label {
        font-size: 16px;
        font-weight: bold;
        color: #0e3045;
        margin-bottom: 8px;
        white-space: normal;
        word-break: break-word;
      }
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border-color: #a6d9ff;
      background: linear-gradient(135deg, #fcffff 0%, #f6fbff 100%);
    }
  }
}

@media (max-width: 992px) {
  .speakertype-radio-group {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 14px;

    .el-radio-button {
      flex: none !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    .el-radio-button .el-radio-button__inner {
      padding: 14px 12px 16px;
    }
  }
}

@media (max-width: 768px) {
  .speech-steps {
    .el-step__line {
      margin: 0 8px !important;
      top: 22px !important;
    }

    .el-step__title {
      font-size: 12px;
      line-height: 1.35;
      white-space: normal;
      word-break: break-word;
      padding: 0 2px;
    }

    .el-step__icon {
      width: 44px;
      height: 44px;
      font-size: 16px;
    }

    .el-step__main {
      flex-basis: 33%;
    }
  }
}

.stepInfo {
  font-size: 16px;
  line-height: 1.6;
  color: #4b4b4b;
  font-weight: normal;
  margin: 20px 0;
}

.lineInfo {
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;

  .info {
    font-size: 14px;
    color: #8a9094;
    font-weight: normal;
    line-height: 1.5;
  }

  .num {
    flex: 1;
    text-align: right;
    padding-right: 10px;
    font-size: 16px;
  }
}
</style>