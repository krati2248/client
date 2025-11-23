import React, { useEffect, useState } from 'react'
import { useApplicantMutation, useJobdetailQuery, useUserdtQuery } from '../features/auth/authApi'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
const Jobdetail = () => {
  const [applicant] = useApplicantMutation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: dt } = useJobdetailQuery(id);
  const { data: d, refetch } = useUserdtQuery();
  const [isLoading, setIsLoading] = useState(false);
  console.log("user data");
  console.log(d);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    file: null,

  });
  useEffect(() => {
    refetch();
    if (d) {
      setUser({
        name: d.name || "",
        email: d.email || "",
        phone: d.phone || "",
        file: null,
      });
    }
  }, [d]);
  const [error, setError] = useState('');
  const ph = /^[0-9]{10}$/;
  const h = () => {
    return (
      
      user.phone && ph.test(user.phone)
      
    )
  }
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    
    setUser((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (!ph.test(user.phone)) {

      return;
    }
    try {
      const data = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        console.log(key, value);
        data.append(key, value);
      });

      console.log(id);
      const res = await applicant({ data, id }).unwrap();

      toast.success('applied successful');
      navigate('/');
    } catch (err) {
      const message = err?.data?.message || 'add failed';
      setError(message);
      toast.error(message);
    }
    finally
    {
      setIsLoading(false);
    }
  };
  return (
    <>
       

      {/* Job Detail Start */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="row gy-5 gx-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-5">
                <img
                  className="flex-shrink-0 img-fluid border rounded"
                  src={dt?.logo.url}
                  alt=""
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="text-start ps-4">
                  <h3 className="mb-3">{dt?.name}</h3>
                  <span className="text-truncate me-3">
                    <i className="fa fa-map-marker-alt text-primary me-2"></i>
                    {dt?.address}
                  </span>
                  <span className="text-truncate me-3">
                    <i className="far fa-clock text-primary me-2"></i>
                    {dt?.type}
                  </span>
                  <span className="text-truncate me-3">
                    <i className="far fa-money-bill-alt text-primary me-2"></i>
                    {dt?.stip}
                  </span>
                  <span className="text-truncate me-3">
                    <i className="far fa-clock text-primary me-2"></i>
                    Last date:{dt&&new Date(dt.last_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="mb-3">Job description</h4>
                 
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dt?.description) }}>
                  
                </div>
                 

                <h4 className="mb-3">Requirements</h4>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dt?.requirement) }}></div>
                 
              </div>

              <div>
                <h4 className="mb-4">Apply For The Job</h4>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <input type="text" className="form-control" name="name" placeholder="Your Name" value={user.name} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="email" className="form-control" name="email" placeholder="Your Email" value={user.email} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input type="tel" className="form-control" name="phone" placeholder="Your Phone no" value={user.phone} maxLength={10} onChange={handleChange} required/>
                     {
                  user.phone && !ph.test(user.phone) && (
                    <p className="text-danger">
                      Phone no. must be 10 digit
                    </p>
                  )
                }
                    </div>
                    <label>Upload Resume</label>
                    <div className="col-12 col-sm-6">
                      <input type="file" name="file" className="form-control bg-white" onChange={handleChange} required />
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit" disabled={!h() || isLoading}>
                         {isLoading ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" /> 
      Applying...
    </>
  ) : (
    'Apply Now'
  )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="bg-light rounded p-5 mb-4 wow slideInUp" data-wow-delay="0.1s">
                <h4 className="mb-4">Job Summary</h4>
                <p><i className="fa fa-angle-right text-primary me-2"></i>Posted On:{new Date(dt?.createdAt).toLocaleDateString()}</p>
                <p><i className="fa fa-angle-right text-primary me-2"></i>Role: {dt?.role}</p>
                <p><i className="fa fa-angle-right text-primary me-2"></i>Vacancy: {dt?.vacancy}</p>
                <p><i className="fa fa-angle-right text-primary me-2"></i>Job Nature: {dt?.type}</p>
                <p><i className="fa fa-angle-right text-primary me-2"></i>Salary:{dt?.stip}</p>
                <p><i className="fa fa-angle-right text-primary me-2"></i>Location:{dt?.address}</p> 
              </div>

               
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Jobdetail
