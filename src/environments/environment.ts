// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  live_url: 'https://fcmdev.thestorywallcafe.com',
  lead_list:'/api/lead-list',
  lead_status:'/api/lead-list-status/',
  lead_subStatus:'/api/lead-list-substatus/',
  lead_season:'/api/season/',
  lead_priority:'/api/priority/',
  lead_campaign:'/api/campaign-lead-list/',
  lead_course:'/api/course-leadlist/',
  lead_upload:'/api/upload-lead-data/',
  lead_refer:'/api/refer-lead-counsellor/',
  lead_note:'/api/note/',
  _user:'/api/user',
  lead_email:'/api/send-emails/',
  raw_data:'/api/upload-lead-data/',
  lead_ids:`/api/get-lead-ids/`,
  whatsapp_template:`/api/template/`,
  lead_follow_up:`/api/add-follow-up/`,
  export_leads:`/api/export-leads/`,
  leadPayment:`/api/send-payment-link/`,
  paymentDetails:`/api/payment-details/`,
  rec_follow_up:`/api/rec_follow_up/`,
  tls_counsellor:`/api/counsellor-sts-typ/`,
  call_logs:`api/call-logs/`,
  counsellor_status:`/api/counsellor-status/`,
  call_log_status:`/api/call-logs-status/`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
