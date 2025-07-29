import React, { useState } from 'react';
import { ChevronRight, Zap, Clock, Building, Globe, Users, Trophy, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const navigate = useNavigate()
  const testimonials = [
    {
      logo: 'assets/khatabook.webp',
      text: "I've worked with IIMS for over a year and I can't praise them enough. They are the best product team I've ever worked with. They are so easy to work with and have a good process for curating new design products. We would love to recommend IIMS to anyone looking for a product team that can build products fast.",
      author: {
        name: 'Shashank Vaishnav',
        role: 'Co-Founder, STAGE',
        image: 'assets/zoop.webp'
      }
    },
    {
      logo: 'assets/paytm.webp',
      text: "We thought hiring 100+ engineers would be extremely hard, but the team at IIMS made the entire process seamless and delivered on time without any hiccups. Their approach was structured, efficient, and highly professional from the initial consultation to the final onboarding. All of the engineers provided were experienced and excellent communicators, fitting right into our team dynamics effortlessly.",
      author: {
        name: 'Subhash Gupta',
        role: 'Vice President - Paytm',
        image: 'assets/google.svg'
      }
    },
    {
      logo: 'assets/zinedu.webp',
      text: "IIMS has been instrumental in helping us achieve our digital transformation goals. With their support, we successfully digitalized operations for 12 companies across Africa, enabling them to scale and innovate more efficiently. Their expertise allowed us to focus on strategic growth while they handled the technical complexities. I highly recommend IIMS to anyone seeking reliable tech solutions.",
      author: {
        name: 'Pramod Venkatesh',
        role: 'Group CTO, INQ',
        image: 'assets/linkedin.svg'
      }
    }
  ];

  const pressFeatures = [
    'zoop', 'paytm', 'khatabook', 'zinedu', 'swiggy', 'zoop'
  ];

    const benefits = [
        {
          icon: <Zap className="w-6 h-6 text-white" />,
          title: 'Top 2% Talent',
          description: 'Access pre-vetted professionals from talent-rich hubs like India.'
        },
        {
          icon: <Zap className="w-6 h-6 text-white" />,
          title: '50% Faster Delivery',
          description: 'Cut project timelines in half with efficient processes and talent.'
        },
        {
          icon: <Clock className="w-6 h-6 text-white" />,
          title: '40% Cost Savings',
          description: 'Optimize operations with transparency and efficiency.'
        },
        {
          icon: <Building className="w-6 h-6 text-white" />,
          title: '30% Faster GCC Setup',
          description: 'Launch with reduced overheads and seamless execution.'
        }
      ];
    

    const companyGroups = [
        {
          title: "VC Portfolio Companies We've Worked With",
          description: "We're proud to have partnered with top VC-backed companies, helping them achieve their growth milestones.",
          companies: [
            ['zinedu', 'zoop', 'paytm', 'khatabook', 'swiggy'],
            ['khatabook', 'paytm', 'swiggy', 'zinedu', 'zoop'],
            ['zoop', 'zinedu', 'khatabook', 'swiggy', 'paytm'],
            ['khatabook', 'swiggy', 'zinedu', 'zoop', 'khatabook'],
            ['swiggy', 'zoop', 'khatabook', 'paytm', 'zinedu']
          ]
        }
      ];
    
      const stats = [
        {
          number: '427',
          label: 'successful IT projects delivered'
        },
        {
          number: '10+ yrs',
          label: 'of proven expertise in scaling businesses'
        },
        {
          number: '90%',
          label: 'reduction in hiring timelines'
        },
        {
          number: '40%',
          label: 'candidate drop-off ratio for contract roles'
        },
        {
          number: '4.5',
          label: 'NPS Score'
        }
      ];
    
      const features = [
        {
          icon: <Trophy className="w-6 h-6" />,
          title: 'Global Recognition',
          description: 'Featured as LinkedIn Top 20 Company (2023, 2024) and part of the Google AI Accelerator Batch (2024).'
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: 'Elite Partnerships',
          description: 'Worked with Y Combinator, Tiger Global, Accel-backed ventures, and Fortune 500 giants like Adani and Apollo Hospitals.'
        },
        {
          icon: <Globe className="w-6 h-6" />,
          title: 'Precision Talent Matching',
          description: 'AI-powered sourcing ensures a 98% joining rate with reduced turnover.'
        }
      ];
  const awards = [
    'assets/khatabook.webp',
    'assets/zoop.webp',
    'assets/paytm.webp',
    'assets/swiggy.webp',
    'assets/zinedu.webp'
  ];

  const investors = [
    {
      name: 'Nikhil Sharma',
      title: 'Managing Director - Head of Partnership at InvestCloud',
      image: 'assets/zinedu.webp',
      company: 'assets/zinedu.webp'
    },
    {
      name: 'Faiz Mayalakkara, FCA',
      title: 'Board of Director - Aster DM Healthcare\nHarvard Business School',
      image: 'assets/zinedu.webp',
      company: 'assets/swiggy.webp'
    },
    {
      name: 'Nitin Sethi',
      title: 'Joint President, Chief Digital Officer - Adani Group',
      image: 'assets/zinedu.webp',
      company: 'assets/paytm.webp'
    },
    {
      name: 'Ankur Warikoo',
      title: 'Founder - WebVeda, Angel Investor\nEx- nearbuy.com',
      image: 'assets/paytm.webp',
      company: 'assets/zoop.webp'
    },
    {
      name: 'Rajesh Gaur, CFA',
      title: 'Head of Investment Solutions, Zoe Financial',
      image: 'assets/khatabook.webp',
      company: 'assets/khatabook.webp'
    },
    {
      name: 'Nimesh Mathur',
      title: 'CHRO at CoreFit, Ex HR Head - Six Habits\nCustomer Success Leader at Branch, Marketfeed',
      image: '/investor6.jpg',
      company: 'assets/zoop.webp'
    }
  ];

  const footerLinks = {
    company: {
      title: "COMPANY",
      links: ["About Us", "Customers", "Partner with Us", "Events", "Careers", "Contact Us"],
    },
    products: {
      title: "OUR PRODUCTS",
      links: ["Hirium"],
    },
    solutions: {
      title: "OUR SOLUTIONS",
      links: ["Staffing", "IT Services", "GCC", "RPO"],
    },
    developers: {
      title: "FOR DEVELOPERS",
      links: ["Developers"],
    },
    resources: {
      title: "RESOURCES",
      links: ["Blog", "The Right Hire", "Case Studies"],
    },
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center relative">
      <img src="assets/logo.svg" alt="IIMS" className="h-8" />

      <button 
          className="md:hidden z-20" 
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>


         {/* Mobile menu */}
         <div className={`fixed inset-0 bg-white z-10 md:hidden transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="pt-20 px-6 flex flex-col space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              Company
              <ChevronRight className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              Offerings
              <ChevronRight className="h-4 w-4" />
            </div>
            <div className="border-b pb-4">
              Case Studies
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              Resources
              <ChevronRight className="h-4 w-4" />
            </div>
            <button onClick={handleClick} className="bg-black text-white px-4 py-2 rounded-md mt-4 w-full">
              Login
            </button>
           
          </div>
        </div>

        <nav className="hidden md:flex space-x-6 items-center">
          <div className="flex items-center">
            Company
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
          <div className="flex items-center">
            Offerings
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
          <div className="flex items-center">
          <span>Case Studies</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
          <div className="flex items-center">
            Resources
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
          <button onClick={handleClick} className="bg-black text-white px-4 py-2 rounded-md">
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 text-center py-16">
      {/*   <div className="flex justify-center gap-8 mb-6">
          <div className="flex items-center">
            <img src="assets/google.svg" alt="Google" className="h-6" />
            <span className="text-sm ml-2">AI ACCELERATOR TOP 20 STARTUPS 2024</span>
          </div>
          <div className="flex items-center">
            <img src="assets/linkedin.svg" alt="LinkedIn" className="h-6" />
            <span className="text-sm ml-2">TOP 20 INDIAN STARTUPS 2023 & 2024</span>
          </div>
        </div> */}

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-blue-600">IIMS Software</span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Services for Global Businesses
        </h2>
        <p className="text-gray-600 mb-8">
          We simplify sourcing, hiring, technology, and everything else in between.
        </p>
        <button onClick={handleClick} className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center mx-auto">
          Go To Admin Dashboard
          <ChevronRight className="ml-2" />
        </button>

        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2">20,000+ REVIEWS</span>
        </div>

        <div className="flex justify-center items-center gap-4 flex-wrap mt-12">
          {awards.map((award, index) => (
            <img key={index} src={award} alt={`Award ${index + 1}`} className="h-16" />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          Build, Scale, and Thrive with IIMS
        </h2>
        <p className="text-center text-gray-600 mb-12">
          From hiring top talent to building innovative solutions, IIMS simplifies
          growth with tailored strategies that deliver measurable impact.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/50 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">AI-Driven Talent Acquisition</h3>
            <p className="text-gray-600 mb-4">
              Streamline hiring with our AI-powered system, which sources the top 2% of
              talent for contract, full-time, and managed roles.
            </p>
            <p className="text-gray-600 mb-6">
              Our process ensures faster, more accurate, and culturally aligned hiring
              tailored to your business needs.
            </p>
            <button className="text-blue-600 flex items-center">
              Learn More
              <ChevronRight className="ml-2" />
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <img src="assets/iimsdashboard.png" alt="Talent Acquisition" className="w-full" />
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Backed by Top Investors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {investors.map((investor, index) => (
            <div key={index} className="text-center">
              {/* <img
                src={investor.image}
                alt={investor.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              /> */}
              <h3 className="font-bold mb-2">{investor.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {investor.title.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </p>
              <img
                src={investor.company}
                alt="Company logo"
                className="h-8 mx-auto"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        
        {companyGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-16">
            <h3 className="text-xl font-bold text-blue-600 mb-2">{group.title}</h3>
            <p className="text-gray-600 mb-8">{group.description}</p>
            
            <div className="grid gap-8">
              {group.companies.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-4 items-center bg-white rounded-lg p-4">
                  {row.map((company, companyIndex) => (
                    <div key={companyIndex} className="flex justify-center">
                      <img 
                        src={`/assets/${company}.webp`} 
                        alt={company}
                        className="h-8 object-contain"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Who We Are Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm">
            WHO WE ARE
          </span>
          <h2 className="text-3xl font-bold mt-4 mb-4">
            Your Partner for Scalable, Efficient, and Transparent Hiring
          </h2>
          <p className="text-gray-600">
            For over a decade, IIMS has helped enterprises hire smarter, scale
            seamlessly, and reduce costs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          {/* Background Globe SVG would go here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm">
            WHY US
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Full-Stack Hiring & GCC Solutions: Your Strategic Advantage
        </h2>
        
        <p className="text-gray-600 mb-12">
          IIMS empowers businesses with flexible solutions —
          <span className="font-semibold">AI-driven Talent Acquisition, 
          IT services, RPO, and GCC setups—</span> to build agile teams and drive growth.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="assets/loginscreen.png" 
              alt="Office Meeting" 
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>


      {/* Bottom CTA Banner */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center py-12 px-4">
          <h2 className="text-3xl font-bold mb-4">
            The Smarter Way to Build, Scale, and Succeed
          </h2>
          <p className="mb-8">
            We help you build the teams and set up your business in the newer market like India.
          </p>
          <button onClick={handleClick} className="bg-white text-blue-600 px-6 py-3 rounded-md inline-flex items-center">
            Go To Dashboard
            <ChevronRight className="ml-2" />
          </button>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          Don't Just Take Our Word
        </h2>
        <p className="text-center text-gray-600 mb-12">
          With an NPS score of 8.5, we drive excellent customer experience and help
          businesses achieve their goals faster.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <img 
                src={testimonial.logo} 
                alt="Company logo" 
                className="h-8 mb-6"
              />
              <p className="text-gray-700 mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.author.image} 
                  alt={testimonial.author.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Press Section */}
      <section className="container mx-auto px-4 py-16 border-t">
        <p className="text-gray-500 mb-8">Featured On:</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {pressFeatures.map((press, index) => (
            <img 
              key={index}
              src={`/assets/${press.toLowerCase()}.webp`}
              alt={press}
              className="h-8 grayscale hover:grayscale-0 transition-all"
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-lg">
              Find Interview-ready candidates in <span className="text-blue-600">24 hours</span>
            </div>
            <button onClick={handleClick} className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
              Go To Dashboard →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          {/* Logo and Description */}
          <div className="mb-12">
            <img src="assets/logo.svg" alt="IIMS" className="mb-4 h-8" />
            <p className="max-w-xl text-gray-600">
              IIMS provides the right tools, technology, talent, and services to easily source, attract, and hire
              talent and expand into talent-rich hubs like India
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {Object.values(footerLinks).map((section, index) => (
              <div key={index}>
                <h3 className="mb-4 text-sm font-semibold text-gray-500">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-600 hover:text-blue-600">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 pt-6 border-t border-gray-200 container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} IIMS Software Services. All rights reserved.
              </div>
              <div className="text-gray-500 text-sm">
                Developed by <a href="#" className="text-blue-600 hover:underline">IIMS Tech Team</a>
              </div>
            </div>
          </div>
    
      </footer>
    </div>
  );
};

export default Home;