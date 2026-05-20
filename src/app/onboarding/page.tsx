"use client"
import { useState, useEffect } from "react";
import "../../styles/onboarding.css";
import { useRouter } from "next/navigation";
import { UserButton } from '@clerk/nextjs'

export default function Onboarding() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string>("");

    useEffect(() => {
        const hasRoadmap = localStorage.getItem('roadmap');
        const urlParams = new URLSearchParams(window.location.search);
        const isNew = urlParams.get('new') === 'true';

        if (hasRoadmap && !isNew) {
            router.push('/dashboard');
        }
    }, [router]);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        course: "",
        year: "",
        stream: "",
        interest: "",
        goal: "",
        timeforgoal: "",
        skillLevel: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    // Validation before going next
    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!formData.name.trim()) newErrors.name = "Please enter your name";
            if (!formData.age) newErrors.age = "Please select your age";
        }

        if (currentStep === 2) {
            if (!formData.course) newErrors.course = "Please select your course";
            if (!formData.year) newErrors.year = "Please select your year";
            if (!formData.stream.trim()) newErrors.stream = "Please enter your stream";
        }

        if (currentStep === 3) {
            if (!formData.interest) newErrors.interest = "Please select your interest";
            if (!formData.goal.trim()) newErrors.goal = "Please enter your career goal";
            if (!formData.timeforgoal) newErrors.timeforgoal = "Please select time available";
            if (!formData.skillLevel) newErrors.skillLevel = "Please select skill level";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleGenerate = async () => {
        if (!validateStep()) return;

        setIsLoading(true);
        setApiError(""); // Clear any previous errors

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Save roadmap to localStorage temporarily
                localStorage.setItem('roadmap', JSON.stringify(data.roadmap));
                // Set cookie for middleware
                document.cookie = "has_roadmap=true; path=/; max-age=31536000";
                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                setApiError(data.error || 'Failed to generate roadmap. Please try again.');
                console.error('API Error:', data.error);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setApiError('Failed to generate roadmap. ' + errorMessage);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const ChipGroup = ({ field, options }: { field: string, options: string[] }) => (
        <div className="chip-group">
            {options.map(option => (
                <button
                    key={option}
                    type="button"
                    className={`chip ${formData[field as keyof typeof formData] === option ? 'chip-active' : ''}`}
                    onClick={() => handleChange(field, option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );

    return (
        <div className="onboarding-section">

            {/* Logo */}
            <div className="onboarding-nav" onClick={() => router.push('/#home')}>
                <h1>PATHPILOT</h1>
                <UserButton />
            </div>

            <div className="onboarding-container">

                {/* Error Message */}
                {apiError && (
                    <div className="error-banner">
                        <span>❌ {apiError}</span>
                    </div>
                )}

                {/* Step Progress */}
                <div className="steps-timeline">
                    {[
                        { num: 1, label: 'Personal Info' },
                        { num: 2, label: 'Academic Info' },
                        { num: 3, label: 'Goals & Interests' }
                    ].map((step, index) => (
                        <div key={step.num} className="step-wrapper">
                            <div className="steps">
                                <div className={`step 
                                    ${currentStep === step.num ? 'step-active' : ''} 
                                    ${currentStep > step.num ? 'step-completed' : ''}
                                    ${currentStep < step.num ? 'step-inactive' : ''}
                                `}>
                                    {currentStep > step.num ? '✓' : step.num}
                                </div>
                                <h3 className={currentStep === step.num ? 'label-active' : 'label-inactive'}>
                                    {step.label}
                                </h3>
                            </div>
                            {index < 2 && (
                                <div className={`timeline-lines ${currentStep > step.num ? 'line-completed' : 'line-incomplete'}`}>
                                    <div className="line-fill" style={{
                                        width: currentStep > step.num ? '100%' : '0%'
                                    }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Content */}
                <div className="step-content">

                    {/* Step 1 */}
                    {currentStep === 1 && (
                        <div className="form-step">
                            <div className="step-header">
                                <div className="step-icon-big"><img src="/images/personal-info.svg" alt="" /></div>
                                <div>
                                    <h2>Personal Info</h2>
                                    <p>Let&apos;s start with the basics</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Full Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                                />
                                {errors.name && <span className="error-msg">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Age <span className="required">*</span></label>
                                <select
                                    value={formData.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                    className={`form-input ${errors.age ? 'input-error' : ''}`}
                                >
                                    <option value="">Select your age</option>
                                    {Array.from({ length: 15 }, (_, i) => i + 16).map(age => (
                                        <option key={age} value={age}>{age} years</option>
                                    ))}
                                </select>
                                {errors.age && <span className="error-msg">{errors.age}</span>}
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                        <div className="form-step">
                            <div className="step-header">
                                <div className="step-icon-big"><img src="/images/academic-info.svg" alt="" /></div>
                                <div>
                                    <h2>Academic Info</h2>
                                    <p>Tell us about your studies</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Course <span className="required">*</span></label>
                                <ChipGroup field="course" options={['B.Tech / B.E', 'BCA / MCA', 'B.Sc', 'BA', 'B.Com',
                                    'BBA', 'BJMC', 'Diploma', 'MBA', 'Other']} />
                                {errors.course && <span className="error-msg">{errors.course}</span>}
                            </div>

                            <div className="form-group">
                                <label>Year <span className="required">*</span></label>
                                <ChipGroup field="year" options={['1st Year', '2nd Year', '3rd Year', '4th Year']} />
                                {errors.year && <span className="error-msg">{errors.year}</span>}
                            </div>

                            <div className="form-group">
                                <label>Stream / Subject <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. Journalism, AI & Data Science"
                                    value={formData.stream}
                                    onChange={(e) => handleChange('stream', e.target.value)}
                                    className={`form-input ${errors.stream ? 'input-error' : ''}`}
                                />
                                {errors.stream && <span className="error-msg">{errors.stream}</span>}
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                        <div className="form-step">
                            <div className="step-header">
                                <div className="step-icon-big"><img src="/images/goals&interest.svg" alt="" /></div>
                                <div>
                                    <h2>Goals & Interests</h2>
                                    <p>What&apos;s your dream career?</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Field of Interest <span className="required">*</span></label>
                                <ChipGroup field="interest" options={['Software Development', 'AI / ML', 'UI/UX Design',
                                    'Data Science', 'Cybersecurity', 'Digital Marketing',
                                    'Journalism & Media', 'Business & Finance',
                                    'Content Creation', 'Graphic Design',
                                    'Product Management', 'Other']} />
                                {formData.interest === 'Other' && (
                                    <input
                                        placeholder="Type your field of interest"
                                        className="form-input other-input"
                                        onChange={(e) => handleChange('interestOther', e.target.value)}
                                    />
                                )}
                                {errors.interest && <span className="error-msg">{errors.interest}</span>}
                            </div>

                            <div className="form-group">
                                <label>Career Goal <span className="required">*</span></label>
                                <textarea
                                    placeholder="e.g. I want to become an ML Engineer at Google"
                                    value={formData.goal}
                                    onChange={(e) => handleChange('goal', e.target.value)}
                                    className={`form-input form-textarea ${errors.goal ? 'input-error' : ''}`}
                                />
                                {errors.goal && <span className="error-msg">{errors.goal}</span>}
                            </div>

                            <div className="form-group">
                                <label>When do you want to achieve this goal? <span className="required">*</span></label>
                                <ChipGroup field="timeforgoal" options={['3 months', '6 months', '1 year', '2+ years']} />
                                {errors.timeforgoal && <span className="error-msg">{errors.timeforgoal}</span>}
                            </div>

                            <div className="form-group">
                                <label>Current Skill Level <span className="required">*</span></label>
                                <ChipGroup field="skillLevel" options={['Complete Beginner', 'Know Basics', 'Intermediate', 'Advanced']} />
                                {errors.skillLevel && <span className="error-msg">{errors.skillLevel}</span>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="form-buttons">
                    <div className="step-counter">
                        Step {currentStep} of 3
                    </div>
                    <div className="btn-group">
                        {currentStep > 1 && (
                            <button className="btn-back" onClick={handleBack}>
                                ← Back
                            </button>
                        )}
                        {currentStep < 3 && (
                            <button className="btn-next" onClick={handleNext}>
                                Next →
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button
                                className="btn-generate"
                                onClick={handleGenerate}
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳ Generating...' : '🚀 Generate My Roadmap'}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}