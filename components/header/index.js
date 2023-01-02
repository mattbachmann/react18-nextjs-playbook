import Image from 'next/image'
import Link from 'next/link'

import styles from './SiteHeader.module.scss'
import logo from './logo.png'

export default function SiteHeader() {

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <div><Image src={logo} alt="" className={styles.logo}/></div>
          <Link href='/'>Home</Link>
          <Link href='/catalog'>Catalog</Link>
        </div>
        <div className={styles.right}>{<a href="" className="cta">Sign In</a>}</div>
      </div>
    </>
  )
}
