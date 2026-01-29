<template>
  <div class="template-preview-container">
    <div class="preview-sidebar">
      <h3>Template Preview</h3>
      <div class="template-list">
        <div 
          v-for="(comp, key) in templates" 
          :key="key"
          :class="['template-item', { active: currentTemplate === key }]"
          @click="currentTemplate = key"
        >
          {{ formatName(key) }}
        </div>
      </div>
    </div>
    <div class="preview-content">
      <div class="preview-wrapper" v-if="currentTemplate">
        <component 
          :is="templates[currentTemplate]" 
          v-bind="dummyData"
        />
      </div>
      <div v-else class="empty-state">
        Select a template to preview
      </div>
    </div>
  </div>
</template>

<script>
// Import all templates
import Template01 from '@/templates/01-abstract-certificate-speaker.vue'
import Template02 from '@/templates/02-abstract-certificate-poster.vue'
import Template03 from '@/templates/03-certificate-attendance.vue'
import Template04 from '@/templates/04-registration-confirmation.vue'
import Template05 from '@/templates/05-invoice.vue'
import Template06 from '@/templates/06-receipt.vue'
import Template07 from '@/templates/07-visa-letter.vue'

export default {
  name: 'TemplatePreview',
  data() {
    return {
      currentTemplate: 'Template01',
      templates: {
        Template01,
        Template02,
        Template03,
        Template04,
        Template05,
        Template06,
        Template07
      },
      dummyData: {
        // Common / Shared
        logoUrl: require('@/assets/img/logo.png'), 
        signatureUrl: require('@/assets/img/signature_kypros.png'),
        congressTitle: '23rd World Congress in Fetal Medicine',
        congressDates: '25-29 June 2026',
        locationCity: 'Valencia',
        locationCountry: 'Spain',
        
        // Speakers / Posters
        speakerName: 'Dr. Jane Doe',
        authors: 'J. Doe, A. Smith, B. Johnson',
        abstractTitle: 'Advances in Fetal Echocardiography: A Systematic Review',
        posterNumber: 'P-123',
        
        // Attendance
        attendeeName: 'Dr. John Smith',
        cmeCredits: '25',
        
        // Registration
        registrantName: 'Dr. John Smith',
        registrationId: 'REG-2026-001',
        registrationType: 'Full Congress',
        amountPaid: '500.00 EUR',
        
        // Finance (Invoice / Receipt)
        invoiceNumber: 'INV-2026-999',
        invoiceDate: '2026-01-20',
        receiptNumber: 'REC-2026-888',
        receiptDate: '2026-01-21',
        billToName: 'Dr. John Smith',
        billToAddress: '123 Medical Blvd, Health City, HC 12345',
        items: [
           { description: 'Congress Registration', quantity: 1, unitPrice: '400.00', total: '400.00' },
           { description: 'Gala Dinner', quantity: 1, unitPrice: '100.00', total: '100.00' }
        ],
        subtotal: '500.00 EUR',
        vat: '0.00 EUR',
        total: '500.00 EUR',
        paymentMethod: 'Credit Card (Visa)',
        
        // Visa Letter
        passportNumber: 'A12345678',
        dateOfBirth: '1980-05-15',
        nationality: 'United Kingdom'
      }
    }
  },
  methods: {
    formatName(key) {
      const map = {
        Template01: '01 - Speaker Certificate',
        Template02: '02 - Poster Certificate',
        Template03: '03 - Attendance Certificate',
        Template04: '04 - Registration Confirmation',
        Template05: '05 - Invoice',
        Template06: '06 - Receipt',
        Template07: '07 - Visa Letter'
      }
      return map[key] || key
    }
  }
}
</script>

<style scoped>
.template-preview-container {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
  padding-top: 72px; /* Header space */
  box-sizing: border-box;
}

.preview-sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
}

.preview-sidebar h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.template-item {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 8px;
  color: #555;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f5f7fa;
}

.template-item.active {
  background: #0f5aa4;
  color: white;
}

.preview-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
}

.preview-wrapper {
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  /* A4 Dimensions approx */
  width: 210mm;
  min-height: 297mm; 
  padding: 0;
  box-sizing: border-box;
  transform-origin: top center;
}

/* Scaling for smaller screens might be needed, but scroll is fine for now */
</style>
