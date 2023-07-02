import nodemailer from 'nodemailer';

export const getDateTimestampNow = () => {
    // const nDate = new Date().toLocaleString('en-US', {
    // 	timeZone: 'Asia/Kuala_Lumpur',
    // });
    // return nDate.toISOString()
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kuala_Lumpur',
    });
    const a = nDate.split(/\D/);
    return (
        a[2] + '-' + a[1] + '-' + a[0] + ' ' + a[4] + ':' + a[5] + ':' + a[6]
    );
};
