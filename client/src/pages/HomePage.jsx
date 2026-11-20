import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import QualificationPills from '../components/home/QualificationPills';
import FeaturedOpportunities from '../components/home/FeaturedOpportunities';
import DedupExplainer from '../components/home/DedupExplainer';
import WhyChooseJobYatra from '../components/home/WhyChooseJobYatra';
import JobDrawer from '../components/jobs/JobDrawer';
import ApplyModal from '../components/jobs/ApplyModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: '10,000+',
    totalCompanies: '1,200+'
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  const { user } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState(new Set(user?.savedJobs || []));

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          api.get('/jobs?limit=12&sort=latest'),
          api.get('/admin/stats').catch(() => null)
        ]);

        if (jobsRes?.data?.jobs) {
          setFeaturedJobs(jobsRes.data.jobs);
        }

        if (statsRes?.data) {
          setStats({
            totalJobs: statsRes.data.totalJobs ? `${statsRes.data.totalJobs.toLocaleString()}+` : '10,000+',
            totalCompanies: statsRes.data.totalCompanies ? `${statsRes.data.totalCompanies.toLocaleString()}+` : '1,200+'
          });
        }
      } catch (err) {
        console.warn('Error fetching homepage data:', err);
      }
    };

    fetchHomeData();
  }, []);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  const handleApply = (job, source) => {
    setSelectedJob(job);
    setSelectedSource(source || job.sources?.[0]);
    setApplyModalOpen(true);
  };

  const handleToggleSave = async (job) => {
    if (!user) {
      navigate('/login?redirect=save');
      return;
    }
    try {
      const res = await api.post(`/jobs/${job._id}/save`);
      const nextSaved = new Set(savedJobIds);
      if (res?.data?.isSaved) {
        nextSaved.add(job._id);
      } else {
        nextSaved.delete(job._id);
      }
      setSavedJobIds(nextSaved);
    } catch (err) {
      console.warn('Toggle save failed', err);
    }
  };

  return (
    <div>
      {/* 1. Hero Section matching layout & colors */}
      <HeroSection stats={stats} />

      {/* 2. Quick Qualification Filter Pills */}
      <QualificationPills />

      {/* 3. Featured Opportunities 3-card grid */}
      <FeaturedOpportunities
        jobs={featuredJobs}
        onSelectJob={handleSelectJob}
        onApply={handleApply}
      />

      {/* 4. Cryptographic SHA-256 Deduplication Visual Showcase */}
      <DedupExplainer />

      {/* 5. Why Choose JobYatra 3 pillars & branding */}
      <WhyChooseJobYatra />

      {/* Slide-over Job Details Drawer */}
      <JobDrawer
        job={selectedJob}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={handleApply}
        onToggleSave={handleToggleSave}
        isSaved={selectedJob ? savedJobIds.has(selectedJob._id) : false}
      />

      {/* Application Gateway Modal */}
      <ApplyModal
        job={selectedJob}
        selectedSource={selectedSource}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
