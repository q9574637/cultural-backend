import mongoose from "mongoose";

const aboutFeatureSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  gradient: String,
});

const footerEventInfoSchema = new mongoose.Schema({
  date: String,
  location: String,
  phone: String,
});

const socialMediaLinksSchema = new mongoose.Schema({
  instagram: String,
  facebook: String,
  twitter: String,
});

const staticContentSchema = new mongoose.Schema(
  {
    festivalName: String,
    festivalDates: String,
    festivalLocation: String,
    heroSubtitle: String,
    stats: {
      eventsCount: String,
      eventsLabel: String,
      celebrationDuration: String,
      celebrationLabel: String,
      participantsCount: String,
      participantsLabel: String,
    },
    aboutTitle: String,
    aboutDescription: String,
    aboutFeatures: [aboutFeatureSchema],
    eventsTitle: String,
    registerTitle: String,
    registerDescription: String,
    registerFormTitle: String,
    registerFormDescription: String,
    registerButtonText: String,
    registerDisclaimer: String,
    eventRegistrationFormUrl: String,
    volunteerTitle: String,
    volunteerDescription: String,
    volunteerFormTitle: String,
    volunteerFormDescription: String,
    volunteerButtonText: String,
    volunteerDisclaimer: String,
    volunteerRegistrationFormUrl: String,
    committeeTitle: String,
    committeeDescription: String,
    footerDescription: String,
    footerQuickLinks: [String],
    footerEventInfo: footerEventInfoSchema,
    socialMediaLinks: socialMediaLinksSchema,
    copyrightText: String,
  },
  { timestamps: true }
);

export default mongoose.model("StaticContent", staticContentSchema);
