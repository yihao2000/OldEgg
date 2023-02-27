import React from 'react';
import styles from '@/styles/componentstyles/footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.section}>
        <h4 className={styles.title}>CUSTOMER SERVICE</h4>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://kb.newegg.com/"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Help Center
          </a>
          <a
            className={styles.linkcontainer}
            href="https://secure.newegg.com/orders/list"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Track an Order
          </a>
          <a
            className={styles.linkcontainer}
            href="https://secure.newegg.com/orders/list"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Return an Item
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>MY ACCOUNT</h4>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://secure.newegg.com/login/signin"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Login/Register
          </a>

          <a
            className={styles.linkcontainer}
            href="https://secure.newegg.com/orders/list"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Order History
          </a>

          <a
            className={styles.linkcontainer}
            href="https://secure.newegg.com/returns/list"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Return History
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>COMPANY INFORMATION</h4>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/corporate/about"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            About NewEgg
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/corporate/homepage"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Investor Relations
          </a>
          <a
            className={styles.linkcontainer}
            href="https://www.newegg.com/d/Info/Awards"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Awards/Rankings
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>TOOLS & RESOURCES</h4>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            style={
              {
                // fontSize: '14px',
              }
            }
            href="https://www.newegg.com/sellers/?cm_sp=sell_on_newegg_footer"
          >
            Sell on Newegg
          </a>
          <a
            className={styles.linkcontainer}
            style={
              {
                // fontSize: '14px',
              }
            }
            href="https://www.neweggbusiness.com/why-business-account?cm_sp=for_your_business_footer"
          >
            For Your Business
          </a>
          <a
            className={styles.linkcontainer}
            style={
              {
                // fontSize: '14px',
              }
            }
            href="https://partner.newegg.com/?cm_sp=newegg_partner_services_footer"
          >
            Newegg Partner Services
          </a>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.title}>SHOP OUR BRANDS</h4>
        <div className={styles.sectioncontent}>
          <a
            className={styles.linkcontainer}
            href="https://www.neweggbusiness.com/"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Newegg Business
          </a>
          <a
            className={styles.linkcontainer}
            href="https://promotions.newegg.com/international/global/index.html"
            style={
              {
                // fontSize: '14px',
              }
            }
          >
            Newegg Global
          </a>
        </div>
      </div>
    </div>
  );
}
