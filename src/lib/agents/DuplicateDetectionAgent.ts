import { DuplicateDetectionData, Location, Issue } from '../../types';

export class DuplicateDetectionAgent {
  /**
   * Hackathon-friendly Haversine distance formula to check if two issues are physically close.
   * Returns distance in meters.
   */
  private static getDistance(loc1: Location, loc2: Location): number {
    const R = 6371e3; // Earth radius in meters
    const lat1 = loc1.lat * Math.PI / 180;
    const lat2 = loc2.lat * Math.PI / 180;
    const deltaLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const deltaLng = (loc2.lng - loc1.lng) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * Processes duplicate detection by comparing the new issue location and type
   * against all existing active issues.
   * In production, use Firestore GeoQueries.
   */
  static process(
    newLocation: Location, 
    newIssueType: string, 
    existingIssues: Issue[], 
    radiusMeters: number = 50
  ): DuplicateDetectionData {
    const duplicates = existingIssues.filter(issue => {
      // Must be same type
      if (issue.vision.issueType.toLowerCase() !== newIssueType.toLowerCase()) return false;
      
      // Must be within radius
      const distance = this.getDistance(newLocation, issue.location);
      return distance <= radiusMeters;
    });

    return {
      similarIssuesNearby: duplicates.length > 0,
      duplicateIssueIds: duplicates.map(d => d.id),
    };
  }
}
