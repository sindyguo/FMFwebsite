<template>
  <div class="page">
    <img class="logo" :src="logoUrl" alt="The Fetal Medicine Foundation" />
    <div class="blue-line" style="top: 38mm;"></div>

    <div class="block center heading" style="top: 60mm; font-size: 26px; font-style: italic;">
      Certificate of Attendance
    </div>
    <div class="block center" style="top: 78mm; font-size: 16px; font-style: italic;">
      This is to certify that
    </div>
    <div class="block center field" style="top: 92mm; font-size: 24px;">
      {{ attendeeTitle }} {{ attendeeName }}
    </div>
    <div class="block center" style="top: 108mm; font-size: 16px; font-style: italic;">
      has attended the
    </div>
    <div class="block center field" style="top: 124mm; font-size: 20px;">
      {{ congressTitle }}
    </div>
    <div class="block center field" style="top: 138mm; font-size: 14px;">
      {{ congressDates }}
    </div>

    <div class="block" style="top: 232mm; font-size: 12px;">
      <span class="field">{{ locationCity }}, {{ locationCountry }}</span>
    </div>
    <div class="block" style="top: 228mm; text-align: right;">
      <div>
        <img :src="signatureUrl" alt="signature" style="height: 18mm;" />
      </div>
      <div class="signature">Director: Kypros Nicolaides</div>
    </div>

    <div class="blue-line" style="top: 270mm;"></div>
    <div class="footer">
      The Fetal Medicine Foundation, 137 Harley Street, London W1G 6BG<br />
      Tel: +44 20 7034 3070, Fax: +44 20 7486 0294, Email: education@fetalmedicine.org
    </div>
  </div>
</template>

<script>
export default {
  name: "CertificateAttendance",
  props: {
    logoUrl: { type: String, default: "" },
    signatureUrl: { type: String, default: "" },
    attendeeTitle: { type: String, default: "" },
    attendeeName: { type: String, default: "" },
    congressTitle: { type: String, default: "" },
    congressDates: { type: String, default: "" },
    locationCity: { type: String, default: "" },
    locationCountry: { type: String, default: "" }
  }
};
</script>

<style src="./base.css"></style>
