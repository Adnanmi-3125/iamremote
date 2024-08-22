'use client';
import { Link } from 'react-scroll';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import JobCard from './components/JobCard';
import styles from './components/Home.module.css';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  const BEARER_TOKEN = "3125mhow3125";

  useEffect(() => {
    fetch('http://localhost:5430/api/jobs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const sortedJobs = data.sort((a, b) => new Date(b.publishedat) - new Date(a.publishedat));
        setJobs(sortedJobs);
        setFilteredJobs(sortedJobs);
      })
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const handleSearch = () => {
    const searchQueryLower = searchQuery.toLowerCase();
    let filtered = jobs.filter(job => {
      const { title, tags, company } = job;
      return (
        title.toLowerCase().includes(searchQueryLower) ||
        tags.toLowerCase().includes(searchQueryLower) ||
        company.toLowerCase().includes(searchQueryLower)
      );
    });

    if (filterCategory) {
      filtered = filtered.filter(job => job.classification === filterCategory);
    }

    setFilteredJobs(filtered);
  };

  const handleFilter = (category) => {
    setFilterCategory(category);
    let filtered = jobs?.filter(job => job.classification === category);

    if (searchQuery) {
      const searchQueryLower = searchQuery.toLowerCase();
      filtered = filtered.filter(job => {
        const { title, tags, company } = job;
        return (
          title.toLowerCase().includes(searchQueryLower) ||
          tags.toLowerCase().includes(searchQueryLower) ||
          company.toLowerCase().includes(searchQueryLower)
        );
      });
    }

    setFilteredJobs(filtered);
  };

  const handleClearFilter = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilteredJobs(jobs);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={styles.homeContainer}>
      <header className="container-fluid py-2 px-4 d-flex justify-content-end" 
              style={{ backgroundColor: 'transparent', position: 'absolute', top: 0, width: '100%' }}>
        <Button variant="danger">Post a remote job</Button>
      </header>

      <div className={`hero-section container-fluid d-flex flex-column align-items-center justify-content-center ${styles.heroSection}`} >
        <h1 className="display-4">
          <strong>Find a</strong> <span className="text-warning"><strong>remote job</strong></span>
        </h1>
        <h2>
          work from <span className="text-warning">anywhere</span>
        </h2>

        <div className={`input-group mt-4 ${styles.inputGroup}`}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
          />
          <Button variant="outline-light" onClick={handleSearch}>Search</Button>
        </div>

        <div className="mt-3">
          <Link to="jobs" className="btn btn-danger me-2">
            Browse remote jobs
          </Link>
        </div>
      </div>

      <div className="container my-4" 
           style={{ maxWidth: '1100px' }}>
        <div className={`d-flex flex-wrap justify-content-center align-items-center ${styles.btnGroup}`} >
          <div className="btn-group me-2" role="group">
            <Button variant="outline-secondary" onClick={() => handleFilter('engineer')}>Engineer</Button>
            <Button variant="outline-secondary" onClick={() => handleFilter('executive')}>Executive</Button>
            <Button variant="outline-secondary" onClick={() => handleFilter('senior')}>Senior</Button>
            <Button variant="outline-secondary" onClick={() => handleFilter('developer')}>Developer</Button>
            <Button variant="outline-secondary" onClick={() => handleFilter('finance')}>Finance</Button>
            <Button variant="outline-secondary" onClick={() => handleFilter('sys admin')}>Sys Admin</Button>
            {(searchQuery || filterCategory) && (
              <Button variant="outline-danger" onClick={handleClearFilter}>Clear</Button>
            )}
          </div>
        </div>

        <div name="jobs" 
             style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {filteredJobs?.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
