// src/app/page.js
'use client';
import { Link } from 'react-scroll';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import JobCard from './components/JobCard';
import styles from './components/Home.module.css';

const BEARER_TOKEN = '2af29778e141512ff7644b7a0bd781b4a4fc73498fd812853c28a219bfa3fb7ec0d3ca6ce539c5676285808cfdd444592629e1d5eea471437902a31bfae2fee0205b38fe7a709424e5dba0448b2d6bd1c82b47f1819a9fe9bc1a1d8234493ab4b8bfa0ec649f4ada275a0651acce5aca899a661b161e22a81339cfc633bd03b1';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:1337/api/Jobs?populate=*', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const sortedJobs = data.data.sort((a, b) => new Date(b.attributes.publishedAt) - new Date(a.attributes.publishedAt));
        setJobs(sortedJobs);
        setJobs(data.data);
        setFilteredJobs(data.data);
      })
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const handleSearch = () => {
    const searchQueryLower = searchQuery.toLowerCase();
    let filtered = jobs.filter(job => {
      const { title, tags, company } = job.attributes;
      return (
        title.toLowerCase().includes(searchQueryLower) ||
        tags.toLowerCase().includes(searchQueryLower) ||
        company.toLowerCase().includes(searchQueryLower)
      );
    });

    if (filterCategory) {
      filtered = filtered.filter(job => job.attributes.classification === filterCategory);
    }

    setFilteredJobs(filtered);
  };

  const handleFilter = (category) => {
    setFilterCategory(category);
    let filtered = jobs?.filter(job => job.attributes.classification === category);

    if (searchQuery) {
      const searchQueryLower = searchQuery.toLowerCase();
      filtered = filtered.filter(job => {
        const { title, tags, company } = job.attributes;
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