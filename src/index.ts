import {fromEvent, Observable} from "rxjs";
import {debounceTime, take} from "rxjs/operators";
import './styles.css';

const RESULT_LENGTH = 10;
console.info('Run');

const input: HTMLInputElement = document.getElementById('searchString') as HTMLInputElement;
const output: HTMLElement = document.getElementById('results')!;

const enteredValues$ : Observable<Event> = fromEvent(input, 'input');

async function getRepositories(query: string) : Promise<any> {
    const res = await fetch(`https://api.github.com/search/repositories?q=${query}`);
    return res.json();
}

enteredValues$
    .pipe(debounceTime(1000))
    .subscribe((change: Event) => {
        output.innerHTML = '';
        const inputValue = (change.target as HTMLInputElement).value;
        getRepositories(inputValue).then((list: any) => {
            for (let i: number = 0; i <RESULT_LENGTH; i++) {
                output.insertAdjacentHTML('beforeend', `<option value=${list.items[i].full_name}></option>`);
            }
        });

    });