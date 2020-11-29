import * as firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: 'stripe-ba5bb',
    clientEmail: 'firebase-adminsdk-9w0qr@stripe-ba5bb.iam.gserviceaccount.com',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCoIABNV/qA6I2w\nSMiDE/AzA+hyuLa+bvk/vPdH3NvtfvIVWDT2ZQDf9WUAHi+veshyca2mj7dwImQE\npYjqoZs3AmdKmmbu+ZnLeSQwqQjt9oRhxIaRLICUzz8nrmtf5Ete6xdmlmcUs9z1\nI1Azpg9X4EW2yyufc3TFg06+IIeFcQTet+8Lhcn/b+jLLBwq++Sl2GQrdHW8/xTO\nVdoVvy6jhrNaFL3FpbCUOrdovA4s3G1/Z9rrZDNKl9whARljMeiXG2aEJmFvhJQN\nwW77IoU8lqJNiOdxhSH7O+gBLAPORB65b7B2lKJziLiNRdd9gMr7XpxM64qlOjQe\nPq+d1PZ7AgMBAAECggEAFv6Ve/6Z9PKZmnBB+GeMNTYGH1azK9WawoRyX8JN1CxG\nKPQw/jgvR/JUt5DpXbtR2hFBOmQypyQVAOuxD8I9q+bowLPgezPpPIKbmAouffl2\n/rY133oyNegoj6FT70AWrOtDfpT4kUTOZjrHt+Cw/YhfkJI2K69LW85LQUbKsk3b\nTkTaTm1316Zd1hA+6EhvuEXDdHBMyuf+MW8QAUOlHisiiTk2tVWfGdVDcW7iPvFE\nEhU0G6t9OxIil0jzbhqa59WaVw3J5/czTqoX+ZUXn3/CZQOaA86vlSGvlPakG98N\nwQPKblMHOzGmX5j/Db4badQP6lVHyknnFCjBq4nYvQKBgQDn3k9zh030ZmdOVrZy\nieUnHILoIZjOoD0nNxUIvMd1onDCrq4mfxBGSkQ7L5TByYQC7Expg2qPHR8hKdMl\nEixeaQXybPmFzLAadhpU4u72KNylP5bQGvX0OlB+Fz88SsYH+/l6jVserLRoNqFH\nftVLVfMCR/YySuogUgi5PiRnJwKBgQC5n169xK9hRLe8PmSG/B1ovCvzjraPh6ot\naS2c29OY6GcEUrMev/+MCL/TyI9Aru4HZ0YMqdUWRjHA4TrQiw4bigwx6XJRU19M\ndO0gs4KfRKOr8yRXlkkqlq+AoRNZEhqGLijJBY7AVRdqDMaAhciycUUcFfmGk1s/\niTaNgZ5qjQKBgGoBPv2oXEFiF9S+3AadeIBbDpYl1gCRTaQCEMG/3MixDTBUQBYl\nfUFFbtBIPpAiGxJjCcQraqonPDYjMv79wf8fsLJWk/VR0Skn2X35ihpMMCP0YHSf\n/tY7WtVqt2RPIx4/Wp1mxsPNXWVPpIhVOhqJHuJqF+qCSWuhVY+rE2V9AoGAQfNq\n4Pfh7ChTM7HjW8Z12IGLCCU7nfFwuGO3ThUYsCpad8G+XH2RGTr+lQucQjok3kKG\nM/efeyODh+k+UVwmrgg1XwJ3mIeLw4mDuuuszFPB51UjI2+FHXmeb5BLZIk3HVeH\nLC0qVBGnmQli+cUO0r/F8z2ng3YVpJRm6o4UL/0CgYAyuN7LCEjHc/LyNbNbeuny\ndoepetO2GVAfnUTpSaqimLGPM1Vaxj/p2+4a+hMdN/36Gy7dFPUP/hQPnaxlSudT\nTNmFjejdRjQo4vG4uSvptH8rNCKmIt8Te8DSdZD0eoR/3OiRJqQ9WuD+EoD90nlU\nklEYAJgAIft2Ldmk6povwQ==\n-----END PRIVATE KEY-----\n',
  }),
});

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
