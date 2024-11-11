import React from "react"
import logo from './assets/logo.png';

export default function Navbar() {
    return (
    <div>
        <nav className="navbar-items">
          <div className="navbar-items-logo">
            <img src={logo} alt="logo"></img>
            <h4>Simple Eat</h4>
          </div>
           <ul className="navbar-items-menu">
            <li>Home</li>
            <li>Recipes
              <ul className="recipes-drop-down">
                <li><a href="">Dishes</a></li>
                <li><a href="">Ingredients</a></li>
              </ul>
            </li>
            
            <li>About us</li>
            <li>Contact</li>
            <li>Get your menu</li>
          </ul>
           </nav>
        
    </div>
        
    )
}