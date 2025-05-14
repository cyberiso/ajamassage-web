import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter, YouTube, LinkedIn, WhatsApp, Telegram } from "@mui/icons-material";
import styles from "./Footer.module.css";
import useSettings from "../../hooks/useSettings";

const Footer = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  
  // Ayarları konsola yazdır
  console.log('Footer settings:', settings);
  console.log('Social Media:', settings.socialMedia);

  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.footerContent}>
        <Box className={styles.footerSection}>
          <Typography variant="h6" component="h6">
            {t("contact")}
          </Typography>
          <Typography component="p">{t("address")}</Typography>
          <Typography component="p">{t("phone")}</Typography>
          <Typography component="p">{t("e-mail")}</Typography>
        </Box>

        <Box className={styles.footerSection}>
          <Typography variant="h6" component="h6">
            {t("quick_links")}
          </Typography>
          <Link to="/" className={styles.footerLink}>
            {t("home")}
          </Link>
          <Link to="/services" className={styles.footerLink}>
            {t("services")}
          </Link>
          {/*          
          <Link to="/treatments" className={styles.footerLink}>
            {t("treatments")}
          </Link>
          */}
          <Link to="/about" className={styles.footerLink}>
            {t("about")}
          </Link>
          <Link to="/contact" className={styles.footerLink}>
            {t("contact")}
          </Link>
          <Link to="/termsandconditions" className={styles.footerLink}>
            {t("terms_and_conditions_link")}
          </Link>
          <Link to="/privacy-policy" className={styles.footerLink}>
            {t("privacy_policy_link")}
          </Link>
        </Box>

        <Box className={styles.footerSection}>
          <Typography variant="h6" component="h6">
            {t("follow_us")}
          </Typography>
          <Box className={styles.socialLinks}>
            {settings.socialMedia?.facebook && (
              <Tooltip title="Facebook">
                <IconButton href={settings.socialMedia.facebook} target="_blank" size="medium" aria-label="Facebook">
                  <Facebook />
                </IconButton>
              </Tooltip>
            )}
            
            {settings.socialMedia?.instagram && (
              <Tooltip title="Instagram">
                <IconButton href={settings.socialMedia.instagram} target="_blank" size="medium" aria-label="Instagram">
                  <Instagram />
                </IconButton>
              </Tooltip>
            )}
            
            {settings.socialMedia?.twitter && (
              <Tooltip title="Twitter">
                <IconButton href={settings.socialMedia.twitter} target="_blank" size="medium" aria-label="Twitter">
                  <Twitter />
                </IconButton>
              </Tooltip>
            )}
            
            {settings.socialMedia?.youtube && (
              <Tooltip title="YouTube">
                <IconButton href={settings.socialMedia.youtube} target="_blank" size="medium" aria-label="YouTube">
                  <YouTube />
                </IconButton>
              </Tooltip>
            )}
            
            {settings.socialMedia?.linkedin && (
              <Tooltip title="LinkedIn">
                <IconButton href={settings.socialMedia.linkedin} target="_blank" size="medium" aria-label="LinkedIn">
                  <LinkedIn />
                </IconButton>
              </Tooltip>
            )}
            
            {settings.socialMedia?.whatsapp && (
              <Tooltip title="WhatsApp">
                <IconButton href={settings.socialMedia.whatsapp} target="_blank" size="medium" aria-label="WhatsApp">
                  <WhatsApp />
                </IconButton>
              </Tooltip>
            )}
            
            {settings.socialMedia?.telegram && (
              <Tooltip title="Telegram">
                <IconButton href={settings.socialMedia.telegram} target="_blank" size="medium" aria-label="Telegram">
                  <Telegram />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      <Box className={styles.copyright}>
        <Typography variant="body2">
          {t("copyright", {
            year: new Date().getFullYear(),
            company: t("company_name"),
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
