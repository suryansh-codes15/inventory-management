import urllib.request
import json

def get_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    repo = "suryansh-codes15/inventory-management"
    runs_url = f"https://api.github.com/repos/{repo}/actions/runs"
    data = get_json(runs_url)
    if not data or 'workflow_runs' not in data:
        print("No workflow runs found.")
        return

    r = data['workflow_runs'][0]
    print(f"Run #{r['run_number']}: {r['name']}")
    print(f"Status: {r['status']}, Conclusion: {r['conclusion']}")
    
    jobs_url = r['jobs_url']
    jobs_data = get_json(jobs_url)
    if jobs_data and 'jobs' in jobs_data:
        for job in jobs_data['jobs']:
            print(f"  Job: {job['name']}, Conclusion: {job['conclusion']}")
            if job['steps']:
                for step in job['steps']:
                    print(f"    Step: {step['name']}, Conclusion: {step['conclusion']}")

if __name__ == "__main__":
    main()
