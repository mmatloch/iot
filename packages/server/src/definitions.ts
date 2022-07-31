export interface PerformanceMetricsStep {
    name: string;
    executionStartDate: string;
    executionEndDate: string;
    executionDuration: number;
}

export interface PerformanceMetrics {
    executionStartDate: string;
    executionEndDate: string;
    executionDuration: number;
    steps: PerformanceMetricsStep[];
}
