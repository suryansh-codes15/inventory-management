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
    print(f"Commit: {r['head_commit']['message']}")

if __name__ == "__main__":
    main()
