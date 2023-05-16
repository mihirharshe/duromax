import { useEffect, useState } from 'react'
import axios from 'axios';
import { Grid } from '@mui/material';
import FinalLabel from './FinalLabel';
import { useParams } from 'react-router-dom';

const ShowLabels = ({ batchId }) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const { id } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [labelDetails, setLabelDetails] = useState([]);
    const [commonLabel, setCommonLabel] = useState([]);

    useEffect(() => {
        const fetchLabels = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/prod/labels/${id}/${batchId}`);
            setLabelDetails(res.data.bucketDetails);
            setCommonLabel({
                name: res.data.productLabelName,
                colorShade: res.data.colorShade,
                batchNo: res.data.batchNo
            });
            setIsLoaded(true);
        }
        fetchLabels();
    }, [])

    return (
        <div>
            <Grid container alignItems="center" justifyContent="space-around">
                {isLoaded &&
                    labelDetails.map((label, index) => {
                        return (
                            <div key={index}>
                                <FinalLabel labelDetails={label} batchId={batchId} commonLabel={commonLabel} />
                            </div>
                        )
                    })
                }
            </Grid>
        </div>
    )
}

export default ShowLabels