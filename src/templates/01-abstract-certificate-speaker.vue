<template>
  <div class="page">
    <img class="logo" :src="logoUrl" alt="The Fetal Medicine Foundation" />
    <div class="blue-line" style="top: 38mm;"></div>

    <div class="block center" style="top: 64mm; font-size: 16px; font-style: italic;">
      This is to certify that
    </div>
    <div class="block center field" style="top: 76mm; font-size: 26px;">
      {{ speakerName }}
    </div>
    <div class="block center" style="top: 90mm; font-size: 16px; font-style: italic;">
      presented orally the abstract
    </div>
    <div class="block center field" style="top: 106mm; font-size: 18px; white-space: pre-line;">
      {{ abstractTitle }}
    </div>
    <div class="block center" style="top: 128mm; font-size: 15px; font-style: italic;">
      by <span class="field">{{ authors }}</span>
    </div>
    <div class="block center" style="top: 146mm; font-size: 16px; font-style: italic;">
      during the
    </div>
    <div class="block center field" style="top: 160mm; font-size: 20px;">
      {{ congressTitle }}
    </div>
    <div class="block center field" style="top: 174mm; font-size: 14px;">
      {{ congressDates }}
    </div>

    <div class="block" style="top: 244mm; font-size: 12px;">
      <span class="field">{{ locationCity }}, {{ locationCountry }}</span>
    </div>
    <div class="block" style="top: 244mm; text-align: right;">
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
  name: "AbstractCertificateSpeaker",
  props: {
    logoUrl: { type: String, default: "" },
    signatureUrl: { type: String, default: "" },
    speakerName: { type: String, default: "" },
    abstractTitle: { type: String, default: "" },
    authors: { type: String, default: "" },
    congressTitle: { type: String, default: "" },
    congressDates: { type: String, default: "" },
    locationCity: { type: String, default: "" },
    locationCountry: { type: String, default: "" }
  }
};
</script>

<style src="./base.css"></style>
