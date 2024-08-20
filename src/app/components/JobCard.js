// src/app/components/JobCard.js

'use client'
import { useState } from 'react';
import { Card, Button, Collapse, Image } from 'react-bootstrap';
import { formatDistanceToNow, parseISO } from 'date-fns';

import styles from './JobCard.module.css'; // Add this import to use custom CSS

const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false);
  const [applyCount, setApplyCount] = useState(job.attributes.applyCount || 0);
  const BEARER_TOKEN = '2af29778e141512ff7644b7a0bd781b4a4fc73498fd812853c28a219bfa3fb7ec0d3ca6ce539c5676285808cfdd444592629e1d5eea471437902a31bfae2fee0205b38fe7a709424e5dba0448b2d6bd1c82b47f1819a9fe9bc1a1d8234493ab4b8bfa0ec649f4ada275a0651acce5aca899a661b161e22a81339cfc633bd03b1';


  const toggleCollapse = () => {
    setOpen(!open);
  };


  const handleApply = async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setApplyCount(applyCount + 1);
      } else {
        console.error('Failed to apply for the job', response.statusText);
      }
    } catch (error) {
      console.error('Error applying for the job', error);
    }
  };
  console.log(handleApply)

  const publishedAt = parseISO(job.attributes.publishedAt);
  const timeAgo = formatDistanceToNow(publishedAt, { addSuffix: true });

  const renderNode = (node, index) => {
    if (node.type === 'text') {
      let content = node.text;
      if (node.bold) content = <strong key={index}>{node.text}</strong>;
      if (node.italic) content = <em key={index}>{node.text}</em>;
      if (node.underline) content = <u key={index}>{node.text}</u>;
      return content;
    }

    return null;
  };

  const renderDescription = (description) => {
    return description.map((desc, index) => {
      if (desc.type === 'paragraph') {
        return (
          <p key={index}>
            {desc.children.map((child, idx) => renderNode(child, idx))}
          </p>
        );
      } else if (desc.type === 'heading') {
        return (
          <h1 key={index}>
            {desc.children.map((child, idx) =>
              child.bold ? (
                <strong key={idx}>{child.text}</strong>
              ) : (
                child.text
              )
            )}
          </h1>
        );
      }

      return null;
    });
  };

  return (
    <Card className={`my-4 ${styles.jobCard}`} style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Card.Header style={{ cursor: 'pointer' }} onClick={toggleCollapse}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Image src='/background.jpg' className={styles.roundedImage} />
            <div className="ms-3">
              <Card.Title>{job.attributes.title}</Card.Title>
              <Card.Text>
               {job.attributes.company} -  <strong>{job.attributes.location}</strong>
              </Card.Text>
              <Button variant="danger" className="mb-1 btn-sm" >{job.attributes.salary}</Button>
             {job.attributes.isRemote ? <Button variant=" btn-outline-dark" className="mb-1 ml-1 btn-sm" > <strong> {job.attributes.isRemote}</strong></Button> : null} 
              <div className={styles.tags}>
                {job.attributes.tags.split(',').map((tag, index) => (
                  <Button  key={index} className="mb-2 mr-1 btn-sm btn btn-dark" >{tag}</Button>

                ))}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center" onClick={(e) => e.stopPropagation()}>
          <Button variant="light" className="mb-2" target="_blank">{timeAgo}</Button>
            <Button variant="danger" className="mb-2" href={job.attributes.applyLink} onClick={handleApply} target="_blank">Apply now</Button>
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
                {renderDescription(job.attributes.description)}
              </div>
            </div>
            <div className={styles.sidePanel}>
              <Image src={'/background.jpg'} className={styles.roundedImage} style={{ width: '200px', height: '200px' }} />
              <br/>
              <h5><strong>{job.attributes.company}</strong></h5>
              <Button variant="danger" className="mb-2" href={job.attributes.applyLink} onClick={handleApply} target="_blank">Apply now</Button>
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