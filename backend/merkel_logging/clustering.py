from typing import List, Dict  # Add this import at the top
import numpy as np
from sklearn.cluster import DBSCAN
from .logger import load_logs
from collections import defaultdict

def fingerprint_to_vector(fp: str, vector_size: int = 8) -> List[int]:
    """Convert hex fingerprint to numerical vector"""
    return [
        int(fp[i:i+vector_size], 16) 
        for i in range(0, len(fp), vector_size)
    ][:vector_size]

def get_clusters(min_size: int = 2) -> Dict:
    logs = load_logs()
    if len(logs) < min_size:
        return {}
    
    # Prepare data
    fingerprints = [log["fingerprint"] for log in logs]
    vectors = np.array([fingerprint_to_vector(fp) for fp in fingerprints])
    
    # Cluster using DBSCAN
    clustering = DBSCAN(eps=1e15, min_samples=min_size).fit(vectors)
    
    # Format results
    clusters = defaultdict(list)
    for idx, label in enumerate(clustering.labels_):
        if label != -1:  # Skip noise
            clusters[str(label)].append(logs[idx])
    
    return dict(clusters)
