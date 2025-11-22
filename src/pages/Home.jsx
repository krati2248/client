import React, { useState, useEffect } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetjobsQuery } from '../features/job/jobApi';
import { useApplicantcounQuery, useCardQuery, useCategoriesQuery, useCatnameMutation, useCdQuery, useCheckSessionQuery, useDpostQuery, useFtypeMutation, useGetpostQuery, useApplyScardMutation } from '../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setCategory } from '../features/job/jobSlice';
import { toast } from 'react-toastify';
import { useSyncExternalStore } from 'react';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: l } = useApplicantcounQuery();
  const { data: p } = useCategoriesQuery();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data: a } = useCardQuery();
  const { data: cdDt } = useCdQuery();
  const locati = useLocation();
  const [categoy, setCategoy] = useState("");
  const [Scard] = useApplyScardMutation();
  const [serch, setSerch] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState("");
  const [ld, setLd] = useState(false);
  const handleSearchClick = () => {
    setShowInput(!showInput);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    const h = sessionStorage.getItem("setH");
    console.log(locati.state);
    if (locati.state?.message && !h) {
      toast.success(locati.state.message);
      sessionStorage.setItem("setH", "true");
    }
    return (() => {
      sessionStorage.removeItem("setH");
    })
  }, [locati.state]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: coun } = useGetpostQuery();
  console.log(coun?.coun);
  //const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const { data: jobs } = useGetjobsQuery();
  const { data } = useCheckSessionQuery();

  const [card, setCard] = useState(null);
  const { data: dt } = useDpostQuery();
  useEffect(() => {
    if (!serch && a) {
      setCard(a);
    }
  }, [a, serch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let pt = new Set();
  cdDt?.map((elet) => pt.add(elet.address));
  let cate = Array.from(pt);
  let categy = [];
  console.log(data);
  if (!data) {
    console.log("hello");

    categy = cdDt?.reduce((ar, post) => {
      let i = ar.find(elet => elet.category === post.category);
      console.log(i);
      if (i) {
        i.coun++;
      }
      else {
        ar.push({ category: post.category, coun: 1 });
      }

      return ar;
    }, []);
  }
  else {

    //console.log(a.length);
    categy = a?.reduce((ar, post) => {
      let i = ar.find(elet => elet.category === post.category);
      console.log(i);
      if (i) {
        i.coun++;
      }
      else {
        ar.push({ category: post.category, coun: 1 });
      }

      return ar;
    }, []);
  }

  const [categ] = useCatnameMutation();
  console.log("h");
  console.log(categy);

  const pcategory = async (catname) => {
    console.log(catname);
    const res = await categ({ category: catname }).unwrap();
    console.log("category");
    console.log(typeof res);
    console.log(res);
    dispatch(setCategory(res));
    localStorage.setItem("category", JSON.stringify(res));
    navigate("/list");
  }

  const [ftype] = useFtypeMutation();

  const fetc = async (tp) => {
    try {
      if (serch) {
        console.log(categoy);
        const res = await ftype({ type: tp, categoy, location }).unwrap();
        console.log("l");
        console.log(res);
        console.log("i");
        setCard(res);
      }
      else {
        console.log(tp);
        const res = await ftype({ type: tp }).unwrap();
        console.log("l");
        console.log(res);
        console.log("i");
        setCard(res);
      }
    }
    catch (er) {
      console.error("Error:", er);
    }

  }
  const handleSerch = async (e) => {
    setLd(true);
    console.log('Category:', categoy);
    console.log('Location:', location);

    setSerch(true);
    try {
      const resp = await Scard({ categoy, location }).unwrap();
      console.log("dt");
      console.log(resp);
      setCard(resp);
    }
    catch (error) {
      console.log(error);
    }
    setLd(false);
  };

  const ar = ['no. of post', 'no. of applicant'];
  return (
    <>


      {data ? (data.role == 'jobseeker' ?
        <>
          <div className='container'>

            <div className="py-5 bg-dark page-header container" style={{ "height": "480px", "marginBottom": "120px" }}>
              <div className="container my-5 pt-5 pb-4">
                <h1 className="text-white mb-3 animated slideInDown">Connecting You With Opportunities.</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb text-uppercase">


                  </ol>
                </nav>
              </div>
            </div>
          </div>





        </> : <>

          <div className="p-4" style={{ marginLeft: isMobile ? "0px" : "240px" }}>

            <div className="row g-4">

              <div className="col-lg-3 col-sm-6 wow fadeInUp" >
                <Link to="/" className="cat-item rounded p-4 text-decoration-none">
                  {/* <i className={`fa fa-3x ${category.icon} text-primary mb-4`}></i> */}
                  <h6 className="mb-3">No. of post</h6>
                  <p className="mb-0">{coun?.coun}</p>
                </Link>
              </div>

              <div className="col-lg-3 col-sm-6 wow fadeInUp" >
                <Link to="/" className="cat-item rounded p-4 text-decoration-none">
                  {/* <i className={`fa fa-3x ${category.icon} text-primary mb-4`}></i> */}
                  <h6 className="mb-3">No. of applicants</h6>
                  {l}
                </Link>
              </div>


            </div>
            <div className='container'>
              <table class="table table-striped mt-4">
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">View applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {dt?.map((d) => <tr>

                    <td>{d.role}</td>

                    <td><Link to={`/view/${d._id}`} className="btn btn-primary mx-1">
                      applicants applied
                    </Link>
                    </td>
                  </tr>)}

                </tbody>
              </table>
            </div>
          </div>




        </>) : null
      }
      {data ? (data.role == 'jobseeker' ?
        <div>
          <div className="container-xxl py-5 mb-5">
            <div className="container">
              <div className="row g-5 align-items-center">

                {/* Image Section */}
                <div className="col-lg-6 wow fadeIn text-center position-relative" data-wow-delay="0.1s">

                  {/* Floating Blur Circle - Decoration */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "200px",
                      height: "200px",
                      background: "rgba(0, 123, 255, 0.15)",
                      filter: "blur(60px)",
                      borderRadius: "50%",
                      zIndex: 0
                    }}
                  />

                  {/* Image Card */}
                  <div
                    style={{
                      display: "inline-block",
                      padding: "15px",
                      background: "#ffffff",
                      borderRadius: "20px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <img
                      className="img-fluid"
                      src="/img/about-3.jpg"
                      alt="About"
                      style={{
                        width: "80%",   // smaller image display
                        borderRadius: "15px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={e => (e.currentTarget.style.transform = "scale(1.07)")}
                      onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>

                </div>

                {/* Text Section */}
                <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">

                  {/* Gradient Accent Line */}


                  <h4 className="mb-4 fw-bold" style={{ lineHeight: "1.3" }}>
                    We Help You Get the Best Job
                  </h4>

                  <p className="mb-4">
                    Our applicant portal connects skilled professionals with trusted companies.
                    Apply easily, explore great opportunities, and grow your career with us.
                  </p>

                  {/* Checkmark List */}
                  <div className="mb-4">
                    <p><i className="fa fa-check text-primary me-3"></i>Fast & simple application process</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Verified company listings</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Real-time job updates</p>
                  </div>

                  <a className="rounded-pill btn btn-primary py-3 px-5 mt-2" href="#">
                    Read More
                  </a>

                </div>

              </div>
            </div>
          </div>


          <div className="container py-5 w-75" >
            <h4 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
              Explore By Category
            </h4>

            <div className="row g-5">

              {categy && categy.length !== 0 ? (
                categy.map((categry, index) => (

                  <div
                    className="col-lg-3 col-sm-6 wow fadeInUp"
                    onClick={() => pcategory(categry.category)}
                    data-wow-delay={categry.delay}
                    key={index}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="category-card p-4 rounded text-center"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #eee",
                        borderRadius: "18px",
                        transition: "all 0.3s ease",
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0px 8px 25px rgba(0,0,0,0.10)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0px 4px 20px rgba(0,0,0,0.05)";
                      }}
                    >
                      {/* Icon Container */}
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          background: "rgba(0, 123, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px auto",
                        }}
                      >
                        <i className="fa fa-briefcase text-primary fa-lg"></i>
                        {/* You can dynamically set icon if available */}
                      </div>

                      <h6 className="mb-3 text-dark">{categry.category}</h6>
                      <p className="mb-0 text-muted">{categry.coun} posts</p>
                    </div>
                  </div>

                ))
              ) : (
                <p className="text-center fs-4 text-capitalize">Not found any category</p>
              )}

            </div>
          </div>

          <h4 className="text-center mb-5 wow fadeInUp mt-5" data-wow-delay="0.1s">
            Find Job
          </h4>
          <div className="container my-4 d-flex justify-content-center">
            <div
              className="p-3 w-100"
              style={{
                maxWidth: "800px",
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0px 3px 12px rgba(0,0,0,0.4)"
              }}
            >
              <div className="row g-3 align-items-center">

                {/* CATEGORY */}
                <div className="col-md-6">
                  <select
                    className="form-select"
                    style={{
                      padding: "10px",
                      borderRadius: "12px",
                      border: "1px solid #ced4da",
                      fontSize: "14px"
                    }}
                    value={categoy}
                    onChange={(e) => setCategoy(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categy?.map((elet, index) => (
                      <option key={index} value={elet.category}>
                        {elet.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LOCATION */}
                <div className="col-md-5">
                  <select
                    className="form-select"
                    style={{
                      padding: "10px",
                      borderRadius: "12px",
                      border: "1px solid #ced4da",
                      fontSize: "14px"
                    }}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select location</option>
                    {cate?.map((elet, index) => (
                      <option key={index} value={elet}>
                        {elet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SEARCH BUTTON WITH ICON */}
                <div className="col-md-1">
                  <button
                    style={{
                      padding: "10px",
                      background: "#00B074",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "45px",
                      height: "45px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "0.3s",
                      border: "none",
                      cursor: "pointer"
                    }}
                    onClick={handleSerch} disabled={ld}>
                    {ld ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

                      </>
                    ) : (
                      <i className="bi bi-search"></i>
                    )}

                  </button>

                </div>

              </div>
            </div>
          </div>


          <div className="container-xxl py-5">
            <div className="container">

              <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.3s">
                <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                  <li className="nav-item">
                    <a
                      className="d-flex align-items-center text-start mx-3 ms-0 pb-3 active"
                      data-bs-toggle="pill"
                      href="#tab-1" onClick={() => fetc("all")}
                    >
                      <h6 className="mt-n1 mb-0">All</h6>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex align-items-center text-start mx-3 pb-3"
                      data-bs-toggle="pill"
                      href="#tab-2" onClick={() => fetc("full time")}
                    >
                      <h6 className="mt-n1 mb-0">Full Time</h6>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex align-items-center text-start mx-3 me-0 pb-3"
                      data-bs-toggle="pill"
                      href="#tab-3" onClick={() => fetc("part time")}
                    >
                      <h6 className="mt-n1 mb-0">Part Time</h6>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div id="tab-1" className="p-0">
              {card && card.length > 0 ? (
                card.map((job, index) => (
                  <div className="d-flex justify-content-center">
                    <div key={index} className="job-item p-4 mb-4" style={{ backgroundColor: "#f9fafb", maxWidth: "880px", width: "100%" }}>
                      <div className="row g-4">
                        <div className="col-sm-12 col-md-8 d-flex align-items-center">
                          <img
                            className="flex-shrink-0 img-fluid border rounded"
                            src={job.logo.url}
                            alt=""
                            style={{ width: '80px', height: '80px' }}
                          />
                          <div className="text-start ps-4">
                            <h6 className="mb-2">{job.name}</h6>
                            <p>Role:{job.role}</p>
                            <span className="text-truncate me-3">
                              <i className="fa fa-map-marker-alt text-primary me-2"></i>
                              {job.address}
                            </span>
                            <span className="text-truncate me-3">
                              <i className="far fa-clock text-primary me-2"></i>
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                          <div className="d-flex mb-3">
                            <Link to={`/jobdetail/${job._id}`} className="btn btn-primary">
                              Apply Now
                            </Link>
                          </div>
                          <small className="text-truncate">

                            Posted on: {new Date(job.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h4 className='text-center'>Not found any job...</h4>
              )}
            </div>



          </div>
        </div>
        : null) : <>
        <div>
          <div className="container py-5 bg-dark page-header" style={{ marginBottom: "124px" }}>
            <div className="container my-5 pt-5 pb-4">
              <h1 className="text-white mb-3 animated slideInDown">Connecting You With Opportunities.</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb text-uppercase">


                </ol>
              </nav>
            </div>
          </div>
        </div>
        <div className="container-xxl py-5 mb-5">
          <div className="container">
            <div className="row g-5 align-items-center">

              {/* Image Section */}
              <div className="col-lg-6 wow fadeIn text-center position-relative" data-wow-delay="0.1s">

                {/* Floating Blur Circle - Decoration */}
                <div
                  style={{
                    position: "absolute",
                    top: "-40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "200px",
                    height: "200px",
                    background: "rgba(0, 123, 255, 0.15)",
                    filter: "blur(60px)",
                    borderRadius: "50%",
                    zIndex: 0
                  }}
                />

                {/* Image Card */}
                <div
                  style={{
                    display: "inline-block",
                    padding: "15px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <img
                    className="img-fluid"
                    src="/img/about-3.jpg"
                    alt="About"
                    style={{
                      width: "70%",
                      height: "80%",
                      borderRadius: "15px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={e => (e.currentTarget.style.transform = "scale(1.07)")}
                    onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>

              </div>

              {/* Text Section */}
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">

                {/* Gradient Accent Line */}


                <h4 className="mb-4 fw-bold" style={{ lineHeight: "1.3" }}>
                  We Help You Get the Best Job
                </h4>

                <p className="mb-4">
                  Our applicant portal connects skilled professionals with trusted companies.
                  Apply easily, explore great opportunities, and grow your career with us.
                </p>

                {/* Checkmark List */}
                <div className="mb-4">
                  <p><i className="fa fa-check text-primary me-3"></i>Fast & simple application process</p>
                  <p><i className="fa fa-check text-primary me-3"></i>Verified company listings</p>
                  <p><i className="fa fa-check text-primary me-3"></i>Real-time job updates</p>
                </div>

                <a className="rounded-pill btn btn-primary py-3 px-5 mt-2" href="#">
                  Read More
                </a>

              </div>

            </div>
          </div>
        </div>
        <div className="container py-5 w-75" style={{ marginBottom: "124px" }}>
          <h4 className="text-center mb-5 wow fadeInUp mt-5" data-wow-delay="0.1s">
            Explore By Category
          </h4>

          <div className="row g-5">

            {categy && categy.length !== 0 ? (
              categy.map((categry, index) => (

                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  onClick={() => data ? pcategory(categry.category) : navigate('/login')}
                  data-wow-delay={categry.delay}
                  key={index}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="category-card p-4 rounded text-center"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #eee",
                      borderRadius: "18px",
                      transition: "all 0.3s ease",
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0px 8px 25px rgba(0,0,0,0.10)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0px 4px 20px rgba(0,0,0,0.05)";
                    }}
                  >
                    {/* Icon Container */}
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(0, 123, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px auto",
                      }}
                    >
                      <i className="fa fa-briefcase text-primary fa-lg"></i>
                      {/* You can dynamically set icon if available */}
                    </div>

                    <h6 className="mb-3 text-dark">{categry.category}</h6>
                    <p className="mb-0 text-muted">{categry.coun} job available</p>
                  </div>
                </div>

              ))
            ) : (
              <p className="text-center fs-4 text-capitalize">Not found any category</p>
            )}

          </div>
        </div>
        <h4 className="text-center mb-5 wow fadeInUp mt-5" data-wow-delay="0.1s">
          Find Job
        </h4>
        <div className="container my-4 d-flex justify-content-center">
          <div
            className="p-3 w-100"
            style={{
              maxWidth: "800px",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0px 3px 12px rgba(0,0,0,0.4)"
            }}
          >
            <div className="row g-3 align-items-center">

              {/* CATEGORY */}
              <div className="col-md-6">
                <select
                  className="form-select"
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    border: "1px solid #ced4da",
                    fontSize: "14px"
                  }}
                  value={categoy}
                  onChange={(e) => setCategoy(e.target.value)}
                >
                  <option value="" disabled>Select Category</option>
                  {categy?.map((elet, index) => (
                    <option key={index} value={elet.category}>
                      {elet.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION */}
              <div className="col-md-5">
                <select
                  className="form-select"
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    border: "1px solid #ced4da",
                    fontSize: "14px"
                  }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="" disabled>Select Location</option>
                  {cate?.map((elet, index) => (
                    <option key={index} value={elet}>
                      {elet}
                    </option>
                  ))}
                </select>
              </div>

              {/* SEARCH BUTTON WITH ICON */}
              <div className="col-md-1">
                <button
                  style={{
                    padding: "10px",
                    background: "#00B074",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "0.3s",
                    border: "none",
                    cursor: "pointer"
                  }}
                  onClick={handleSerch}>
                  <i className="bi bi-search"></i>
                </button>

              </div>

            </div>
          </div>
        </div>

        <div>


          <div className="container-xxl py-5">
            <div className="container-xxl py-5">
              <div className="container">

                <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.3s">
                  <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                    <li className="nav-item">
                      <a
                        className="d-flex align-items-center text-start mx-3 ms-0 pb-3 active"
                        data-bs-toggle="pill"
                        href="#tab-1" onClick={() => fetc("all")}
                      >
                        <h6 className="mt-n1 mb-0">All</h6>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="d-flex align-items-center text-start mx-3 pb-3"
                        data-bs-toggle="pill"
                        href="#tab-2" onClick={() => fetc("full time")}
                      >
                        <h6 className="mt-n1 mb-0">Full Time</h6>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="d-flex align-items-center text-start mx-3 me-0 pb-3"
                        data-bs-toggle="pill"
                        href="#tab-3" onClick={() => fetc("part time")}
                      >
                        <h6 className="mt-n1 mb-0">Part Time</h6>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>



            <div id="tab-1" className="p-0">

              {card ? (card.length > 0 ? (card.map((job, index) => (
                <div className="d-flex justify-content-center">

                  <div key={index} className="job-item p-4 mb-4" style={{ backgroundColor: "#f9fafb", maxWidth: "880px", width: "100%" }}>
                    <div className="row g-4">
                      <div className="col-sm-12 col-md-8 d-flex align-items-center">
                        <img
                          className="flex-shrink-0 img-fluid border rounded"
                          src={job.logo.url}
                          alt=""
                          style={{ width: '80px', height: '80px' }}
                        />
                        <div className="text-start ps-4">
                          <h6 className="mb-3">{job.name}</h6>
                          <p>Role:{job.role}</p>
                          <span className="text-truncate me-3">
                            <i className="fa fa-map-marker-alt text-primary me-2"></i>
                            {job.address}
                          </span>
                          <span className="text-truncate me-3">
                            <i className="far fa-clock text-primary me-2"></i>
                            {job.type}
                          </span>
                          <span className="text-truncate me-0">
                            <i className="far fa-money-bill-alt text-primary me-2"></i>
                            {job.stip}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                        <div className="d-flex mb-3">

                          <Link to={`/jobdetail/${job._id}`} className="btn btn-primary">
                            Apply Now
                          </Link>
                        </div>
                        <small className="text-truncate">

                          Posted on: {new Date(job.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div></div>
              ))) : <h4 className="text-center">Not found...</h4>) : (jobs?.map((job, index) => (

                <div className="d-flex justify-content-center">
                  <div key={index} className="job-item p-4 mb-4" style={{ backgroundColor: "#f9fafb", maxWidth: "880px", width: "100%" }}>
                    <div className="row g-4">
                      <div className="col-sm-12 col-md-8 d-flex align-items-center">
                        <img
                          className="flex-shrink-0 img-fluid border rounded"
                          src={job.logo.url}
                          alt=""
                          style={{ width: '80px', height: '80px' }}
                        />
                        <div className="text-start ps-4">
                          <h6 className="mb-3">{job.name}</h6>
                          <p>Role: {job.role}</p>
                          <span className="text-truncate me-3">
                            <i className="fa fa-map-marker-alt text-primary me-2"></i>
                            {job.address}
                          </span>
                          <span className="text-truncate me-3">
                            <i className="far fa-clock text-primary me-2"></i>
                            {job.type}
                          </span>
                          <span className="text-truncate me-0">
                            <i className="far fa-money-bill-alt text-primary me-2"></i>
                            {job.stip}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                        <div className="d-flex mb-3">

                          <Link to='/login' className="btn btn-primary">
                            Apply Now
                          </Link>
                        </div>
                        <small className="text-truncate">

                          Posted on: {new Date(job.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              )))}

            </div>



          </div>
        </div>
      </>}
    </>

  )
}

export default Home
