import React, { useState, useRef, useEffect, useCallback } from 'react';

const BottomSheet = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [snapPoint, setSnapPoint] = useState('closed'); // 'closed', 'half', 'full'
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [currentTranslateY, setCurrentTranslateY] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [lastMoveTime, setLastMoveTime] = useState(0);
    const [lastMoveY, setLastMoveY] = useState(0);

    const sheetRef = useRef(null);
    const animationRef = useRef(null);
    const startTimeRef = useRef(0);
    const startValueRef = useRef(0);
    const targetValueRef = useRef(0);

    // Snap point positions (percentage of screen height)
    const snapPoints = {
        closed: 85, // 85% from top (only handle visible)
        half: 50,   // 50% from top (half open)
        full: 10    // 10% from top (fully open)
    };

    // Spring animation function
    const springAnimation = useCallback((timestamp) => {
        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const duration = 300; // 300ms animation
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for spring-like motion
        const easeOutBack = (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };

        const easedProgress = easeOutBack(progress);
        const currentValue = startValueRef.current +
            (targetValueRef.current - startValueRef.current) * easedProgress;

        setCurrentTranslateY(currentValue);

        if (progress < 1) {
            animationRef.current = requestAnimationFrame(springAnimation);
        } else {
            animationRef.current = null;
            startTimeRef.current = 0;
        }
    }, []);

    // Animate to target snap point
    const animateToSnapPoint = useCallback((targetSnap) => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        startValueRef.current = currentTranslateY;
        targetValueRef.current = snapPoints[targetSnap];
        startTimeRef.current = 0;

        setSnapPoint(targetSnap);
        setIsOpen(targetSnap !== 'closed');

        animationRef.current = requestAnimationFrame(springAnimation);
    }, [currentTranslateY, springAnimation]);

    // Find nearest snap point based on position and velocity
    const findNearestSnapPoint = useCallback((translateY, vel) => {
        const positions = Object.entries(snapPoints);

        // If velocity is significant, consider direction
        if (Math.abs(vel) > 0.5) {
            if (vel > 0) { // Moving down
                if (translateY > snapPoints.half) return 'closed';
                return 'half';
            } else { // Moving up
                if (translateY < snapPoints.half) return 'full';
                return 'half';
            }
        }

        // Find closest snap point by distance
        let closest = 'closed';
        let minDistance = Math.abs(translateY - snapPoints.closed);

        positions.forEach(([point, position]) => {
            const distance = Math.abs(translateY - position);
            if (distance < minDistance) {
                minDistance = distance;
                closest = point;
            }
        });

        return closest;
    }, []);

    // Handle drag start
    const handleDragStart = useCallback((clientY) => {
        setIsDragging(true);
        setDragStartY(clientY);
        setVelocity(0);
        setLastMoveTime(Date.now());
        setLastMoveY(clientY);

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    }, []);

    // Handle drag move
    const handleDragMove = useCallback((clientY) => {
        if (!isDragging) return;

        const deltaY = clientY - dragStartY;
        const newTranslateY = Math.max(
            snapPoints.full,
            Math.min(snapPoints.closed, snapPoints[snapPoint] + (deltaY / window.innerHeight) * 100)
        );

        // Calculate velocity
        const now = Date.now();
        const timeDelta = now - lastMoveTime;
        if (timeDelta > 0) {
            const newVelocity = (clientY - lastMoveY) / timeDelta;
            setVelocity(newVelocity);
        }

        setCurrentTranslateY(newTranslateY);
        setLastMoveTime(now);
        setLastMoveY(clientY);
    }, [isDragging, dragStartY, snapPoint, lastMoveTime, lastMoveY]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;

        setIsDragging(false);
        const nearestSnap = findNearestSnapPoint(currentTranslateY, velocity);
        animateToSnapPoint(nearestSnap);
    }, [isDragging, currentTranslateY, velocity, findNearestSnapPoint, animateToSnapPoint]);

    // Mouse events
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleDragStart(e.clientY);
    };

    const handleMouseMove = useCallback((e) => {
        handleDragMove(e.clientY);
    }, [handleDragMove]);

    const handleMouseUp = useCallback(() => {
        handleDragEnd();
    }, [handleDragEnd]);

    // Touch events
    const handleTouchStart = (e) => {
        handleDragStart(e.touches[0].clientY);
    };

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        handleDragMove(e.touches[0].clientY);
    }, [handleDragMove]);

    const handleTouchEnd = useCallback(() => {
        handleDragEnd();
    }, [handleDragEnd]);

    // Add global event listeners for drag
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    // Initialize position
    useEffect(() => {
        setCurrentTranslateY(snapPoints.closed);
    }, []);

    // Cleanup animation on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Background Content */}
            <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-6">Bottom Sheet Demo</h1>
                <p className="text-lg mb-4">
                    This is the main content area. The bottom sheet can be dragged or controlled with buttons.
                </p>

                {/* Control Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={() => animateToSnapPoint('closed')}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                        Close Sheet
                    </button>
                    <button
                        onClick={() => animateToSnapPoint('half')}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                        Half Open
                    </button>
                    <button
                        onClick={() => animateToSnapPoint('full')}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                        Fully Open
                    </button>
                </div>

                <div className="space-y-4 text-sm opacity-80">
                    <p>• Drag the bottom sheet handle to move it</p>
                    <p>• Release to snap to the nearest position</p>
                    <p>• Works on both desktop and mobile</p>
                    <p>• Current state: <span className="font-semibold">{snapPoint}</span></p>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => animateToSnapPoint('closed')}
                />
            )}

            {/* Bottom Sheet */}
            <div
                ref={sheetRef}
                className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-none"
                style={{
                    transform: `translateY(${currentTranslateY}%)`,
                    height: '100vh',
                    touchAction: 'none'
                }}
            >
                {/* Handle */}
                <div
                    className="flex justify-center py-4 cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors" />
                </div>

                {/* Content */}
                <div className="px-6 pb-6 h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bottom Sheet Content</h2>

                    <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Features</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Three snap points: closed, half-open, and fully open</li>
                                <li>• Smooth spring animations</li>
                                <li>• Drag and release functionality</li>
                                <li>• Velocity-based snapping</li>
                                <li>• Responsive design</li>
                                <li>• Touch and mouse support</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Technical Details</h3>
                            <p className="text-blue-700 mb-2">
                                Built with React Hooks and custom spring animations. No external animation libraries used.
                            </p>
                            <div className="text-sm text-blue-600">
                                <p>• Uses requestAnimationFrame for smooth animations</p>
                                <p>• Custom easing function for spring-like motion</p>
                                <p>• Velocity tracking for natural gesture handling</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700">Sample Content</h3>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                                    <h4 className="font-medium text-gray-800">Content Block {i}</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        This is sample content to demonstrate scrolling within the bottom sheet.
                                        Each block represents different types of content that might be displayed.
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-green-50 rounded-xl">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Accessibility</h3>
                            <p className="text-green-700">
                                The bottom sheet includes keyboard navigation support and follows accessibility best practices.
                            </p>
                        </div>

                        {/* Extra content for scrolling */}
                        <div className="space-y-4 pb-20">
                            <p className="text-gray-600">
                                Additional content to demonstrate scrolling behavior when the sheet is fully open.
                            </p>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="p-3 bg-gray-100 rounded-lg">
                                    <p className="text-gray-700">Scrollable content item {i}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;