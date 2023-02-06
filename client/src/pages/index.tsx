import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/home.module.css';
import Link from 'next/link';
import { links } from '@/util/route';




const inter = Inter({ subsets: ['latin'] });

export default function Login() {
  return (
    <>
      <Head>
        <title>OldEgg Sign In</title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

              <div className={styles.formcontainer}>
                <Image alt='Logo' src="/asset/logo.svg" width={170} height={70}/>
                  <h3 className='centered-text'>Sign In</h3>


                    <form action=""

                    style={{
                      width: "100%",
                      paddingBottom: "15px"
                    }}>
                      <input type="email"
                      style={{
                        marginBottom: "15px"
                      }}
                      className={styles.formtextinput}
                      id="email"
                      name="email"
                      required
                      placeholder='Email Address'
                      />

                      <input type='submit' className={`${styles.formbutton} ${styles.themeaccent}`} value="Sign In"/>
                    </form>

                    <button className={styles.formbutton}>GET ONE-TIME SIGN IN CODE</button>
                    <h4 className={`${styles.nopadding} ${styles.nomargin}`}><u>What's the One-Time Code?</u></h4>
                    <h4 className={`${styles.nopadding} ${styles.nomargin}`}>New to Newegg? <Link href={links.signup}><u>Sign Up</u></Link></h4>

                    <button className={styles.formbutton}>SIGN IN WITH GOOGLE</button>
                    <button className={styles.formbutton}>SIGN IN WITH APPLE</button>
              </div>

      </main>
    </>
  );
}
