/**
 * Histogram Component
 * 
 * This component renders a histogram visualization of given labels and amounts.
 * It divides the histogram into pages with a fixed number of bars per page and includes navigation controls.
 * 
 * Features:
 * - Dynamically generates bars representing the amounts for corresponding labels.
 * - Paginates the histogram with navigation buttons (Previous/Next).
 * - Displays bar heights proportional to the largest amount.
 * - Truncates long labels for better readability.
 * 
 * Props:
 * @param {Array<string>} labels - Array of labels for the histogram bars.
 * @param {Array<number>} amounts - Array of amounts corresponding to each label.
 * 
 * @component
 * @example
 * // Example usage
 * <Histogram 
 *   labels={['January', 'February', 'March', 'April', 'May']} 
 *   amounts={[10, 15, 20, 25, 30]} 
 * />
 */

import React, { useState } from 'react';

/**
 * Renders a histogram visualization with pagination support.
 * 
 * @param {Object} props - Props for the component.
 * @param {Array<string>} props.labels - Labels for the histogram bars.
 * @param {Array<number>} props.amounts - Amounts corresponding to each label.
 * @returns {JSX.Element} - The rendered Histogram component.
 */
const Histogram = ({ labels, amounts }) => {
    // State for the current page of the histogram
    const [currentPage, setCurrentPage] = useState(0);

    // Maximum number of bars displayed per page
    const BARS_PER_PAGE = 7;

    /**
     * Navigate to the next page of the histogram.
     * Ensures that the page index does not exceed the total number of pages.
     */
    const handleNext = () => {
        if ((currentPage + 1) * BARS_PER_PAGE < labels.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    /**
     * Navigate to the previous page of the histogram.
     * Ensures that the page index does not go below 0.
     */
    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    /**
     * Generates the histogram bars for the current page.
     * Each bar's height is proportional to its corresponding amount relative to the largest amount.
     * 
     * @returns {Array<JSX.Element>} - Array of bar elements.
     */
    const drawHistogram = () => {
        const largestAmount = Math.max(...amounts); // Determine the largest amount for scaling bar heights
        return labels
            .slice(currentPage * BARS_PER_PAGE, (currentPage + 1) * BARS_PER_PAGE)
            .map((label, index) => {
                const amount = amounts[currentPage * BARS_PER_PAGE + index];
                const barHeight = (amount / largestAmount) * 200; // Scale bar height to a maximum of 200px
                return (
                    <div key={label} style={{ width: '80px', margin: '10px', display: 'inline-block', textAlign: 'center' }}>
                        <div style={{
                            height: `${barHeight}px`,
                            backgroundColor: 'blue',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            borderRadius: '4px'
                        }}>
                        </div>
                        <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.85em' }}>
                            {label.length > 10 ? `${label.substring(0, 7)}...` : label}
                        </span>
                        <br />
                        <span style={{ fontSize: '0.8em' }}>{amount}</span>
                    </div>
                );
            });
    };

    return (
        <div style={{ border: '2px solid #333', padding: '20px', borderRadius: '8px', maxWidth: '800px', margin: '20px auto' }}>
            <h2 style={{ textAlign: 'center' }}>Histogram</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: '220px' }}>
                {drawHistogram()}
            </div>
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button onClick={handlePrevious} disabled={currentPage === 0} style={{ marginRight: '10px' }}>
                    Previous
                </button>
                <button onClick={handleNext} disabled={(currentPage + 1) * BARS_PER_PAGE >= labels.length}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Histogram;
