class Settings {
  static async getAlertSettings(conn) {
    let alertSettings = {};
    console.log('Fetching settings');
    try {
      const [settings] = await conn.query('SELECT * FROM alert_settings;');
      alertSettings = settings[0];
    } catch (e) {
      console.error(e);
    }
    return {
      settings: alertSettings,
    };
  }

  static async saveAlertSettings(conn, settings) {
    const {
      alertsettingsid,
      notification_method,
      destination,
      origin_email,
      polling_frequency,
      warning,
      critical,
      email_subject,
      email_content,
    } = settings;

    try {
      await conn.query(
        `UPDATE alert_settings SET notification_method = '${notification_method}', destination='${destination}', origin_email='${origin_email}', polling_frequency='${polling_frequency}', warning=${warning}, critical=${critical}, email_subject = '${email_subject}', email_content = '${email_content}' WHERE alertsettingsid = ${alertsettingsid};`
      );
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Settings;
