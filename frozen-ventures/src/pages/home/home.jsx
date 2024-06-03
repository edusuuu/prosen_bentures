import React from "react";
import "../../assets/styles/home.css";
import carrousel from "../../assets/images/0.jpg";
import one from "../../assets/images/1.jpg";
import two from "../../assets/images/2.jpg";
import three from "../../assets/images/3.jpg";
import four from "../../assets/images/4.jpg";
import five from "../../assets/images/5.png";
import logo from "../../assets/images/logo.jpg";
import { FacebookLogo } from "phosphor-react";
import { InstagramLogo } from "phosphor-react";
import { TwitterLogo } from "phosphor-react";
import { Products } from "../../products";

export const Home = () => {
  return (
    <div className="home">
      <div class="container hero">
        <div class="first-container">
          <img src={carrousel} alt="Sheesh" />
        </div>

        <div class="second-container">
          <h2>Flavors</h2>
          <p>Various flavors to suit your preferences</p>
        </div>

        <div class="third-container">
          <img class="item1" src={one} alt="" />
          <img class="item2" src={two} alt="" />
          <img class="item3" src={three} alt="" />
          <img class="item4" src={four} alt="" />
        </div>
      </div>

      <div class="random-container">
        <div className="text-container">
          <h2>Some Chilling Finds</h2>
          <p>Explore an Assortment of Epic Discoveries</p>
        </div>

        <div className="product-container">
          <Products />
        </div>
      </div>

      <div class="more-container">
        <div class="tb-container">
          <h2>Need More Flavors?</h2>
          <p>
            Explore our extensive product catalog for a diverse range of
            delicious flavors, from classic favorites to innovative creations.
            Whether you're craving creamy indulgence, there's something to
            satisfy every palate and treat yourself to the perfect ice cream
            experience
          </p>
          <button>More Flavors</button>
        </div>

        <img src={five} alt="" />
      </div>

      <div class="service-container">
        <div class="text-container">
          <h2>Services</h2>
          <p>
            At FrozenVentures, we're passionate about bringing you the finest
            ice cream flavors and treats to satisfy your sweet cravings.
          </p>
        </div>

        <div class="services">
          <div class="service">
            <h3>
              <i class="bx bxs-package"></i> Delivery
            </h3>
            <p>Enjoy convenient ice cream delivery straight to your door.</p>
          </div>

          <div class="service">
            <h3>
              <i class="bx bx-money"></i> Payment
            </h3>
            <p>We accept payment via GCash and cash for your convenience.</p>
          </div>

          <div class="service">
            <h3>
              <i class="bx bxs-donate-heart"></i> Inquiry
            </h3>
            <p>
              For inquiries, contact us via email or phone. We're here to help!
            </p>
          </div>
        </div>
      </div>

      <div className="footer">
        <div class="about-container">
          <div class="logo-container">
            <img src={logo} alt="Logo" />
            <h1>FrozenVentures</h1>
          </div>

          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
            neque veniam perferendis nihil fuga, corporis quidem voluptatum
            iusto, modi quod minus mollitia maxime inventore ad recusandae iure
            deserunt laborum sint!
          </p>
        </div>

        <div class="contact-container">
          <h4>Contact Us</h4>

          <p>#420 Weederoo Street Showbu City</p>

          <p>frozenventures@icecream.com</p>

          <p>+63 9069420911</p>
        </div>

        <div class="social-container">
          <h4>Follow Us</h4>

          <div class="socials">
            <div class="social">
              <FacebookLogo size={30} />
              <p>@FrozenVentures</p>
            </div>

            <div class="social">
              <InstagramLogo size={30} />
              <p>@FrozenVentures</p>
            </div>

            <div class="social">
              <TwitterLogo size={30} />
              <p>@FVtweets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
