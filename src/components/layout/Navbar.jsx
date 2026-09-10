import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../data/data'
import styles from '../../styles/styles'

const Navbar = ({active}) => {
  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
         {
            navItems && navItems.map((i,index) => (
                <div key={navItems.id || index} className="flex">
                    <Link to={i.url}
                    className={`${active === index + 1 ? "text-brand-accent" : "text-black 800px:text-white"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer hover:text-brand-accent transition-colors`}
                    >
                    {i.title}
                    </Link>
                </div>
            ))
         }
    </div>
  )
}

export default Navbar