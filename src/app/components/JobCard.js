'use client'
import { useState } from 'react';
import { Card, Button, Collapse, Image } from 'react-bootstrap';
import { formatDistanceToNow, parseISO } from 'date-fns';

import styles from './JobCard.module.css';

const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false);
  const [applyCount, setApplyCount] = useState(job.applycount || 0);

  const toggleCollapse = () => {
    setOpen(!open);
  };

  const handleApply = async () => {
    try {
      const response = await fetch(`http://localhost:5430/api/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplyCount(data.applyCount);
      } else {
        console.error('Failed to apply for the job', response.statusText);
      }
    } catch (error) {
      console.error('Error applying for the job', error);
    }
  };

  const publishedAt = job.publishedat ? parseISO(job.publishedat) : null;
  const timeAgo = publishedAt ? formatDistanceToNow(publishedAt, { addSuffix: true }) : 'Unknown date';

  const renderDescription = (description) => {
    return <div dangerouslySetInnerHTML={{ __html: description }} />;
  };

  // Ensure tags are properly parsed and split into an array
  const parseTags = (tagsString) => {
    if (!tagsString) return [];
    try {
      // Remove leading and trailing quotes and split by comma
      return tagsString.replace(/(^"|"$)/g, '').split(',');
    } catch (error) {
      console.error('Error parsing tags:', error);
      return [];
    }
  };

  const tags = parseTags(job.tags);

  return (
    <Card className={`my-4 ${styles.jobCard}`} style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Card.Header style={{ cursor: 'pointer' }} onClick={toggleCollapse}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Image src='/background.jpg' className={styles.roundedImage} />
            <div className="ms-3">
              <Card.Title>{job.title}</Card.Title>
              <Card.Text>{job.company} - <strong>{job.location}</strong></Card.Text>
              <Button variant="danger" className="mb-1 btn-sm">{job.salary}</Button>
              {job.isremote ? <Button variant="outline-dark" className="mb-1 ml-1 btn-sm"><strong>{job.isremote}</strong></Button> : null}
              <div className={styles.tags}>
                {tags.map((tag, index) => (
                  <Button key={index} className="mb-2 mr-1 btn-sm btn btn-dark">{tag}</Button>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center" onClick={(e) => e.stopPropagation()}>
            <Button variant="light" className="mb-2">{timeAgo}</Button>
            <Button variant="danger" className="mb-2" href={job.applylink} onClick={handleApply} target="_blank">Apply now</Button>
            <Button variant="light" className="text-decoration-none" onClick={toggleCollapse}>
              {open ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>
      </Card.Header>
      <Collapse in={open}>
        <Card.Body>
          <div className="d-flex" style={{ flexWrap: 'nowrap' }}>
            <div className={styles.mainContent}>
              <div className={styles.mainContentInner}>
                {renderDescription(job.description)}
              </div>
            </div>
            <div className={styles.sidePanel}>
              <Image src={'/background.jpg'} className={styles.roundedImage} style={{ width: '200px', height: '200px' }} />
              <br/>
              <h5><strong>{job.company}</strong></h5>
              <Button variant="danger" className="mb-2" href={job.applylink} onClick={handleApply} target="_blank">Apply now</Button>
              <div>👀 109 views</div>
              <div>✅ {applyCount} (7%)</div>
              <div className="mt-3">
                <strong>Share this job:</strong>
                <div className="input-group mt-1">
                  <input type="text" className="form-control" value="https://remoteok.com/rer" readOnly />
                  <Button variant="outline-secondary" onClick={() => navigator.clipboard.writeText("https://remoteok.com/rer")}>Copy</Button>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Collapse>
    </Card>
  );
};

export default JobCard;
